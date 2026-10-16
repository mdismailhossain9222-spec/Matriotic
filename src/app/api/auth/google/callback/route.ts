import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { loginEvents, users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyLogin } from "@/lib/notify-login";

/**
 * GET /api/auth/google/callback
 *
 * Validates the state + PKCE verifier stored in cookies, exchanges the
 * authorization code for tokens at Google, fetches the user's profile, and
 * upserts a local user row before creating a session cookie.
 */
export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`google-auth:${ip}`, 10, 60_000)) {
    return NextResponse.redirect(
      new URL("/portal?error=rate_limited", req.url),
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Read-only cookie access is fine here; we clear them on the response below.
  const store = await cookies();
  const storedState = store.get("oauth_state")?.value;
  const verifier = store.get("oauth_verifier")?.value;

  const fail = (error: string) => {
    const res = NextResponse.redirect(new URL(`/portal?error=${error}`, req.url));
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_verifier");
    return res;
  };

  if (!code || !state || !storedState || !verifier || state !== storedState) {
    return fail("invalid_state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.replace(/^﻿/, "").trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.replace(/^﻿/, "").trim();
  if (!clientId || !clientSecret) {
    return fail("missing_client_id");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Exchange the authorization code for tokens.
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error("[google-token-debug]", JSON.stringify({
      status: tokenRes.status,
      statusText: tokenRes.statusText,
      body: errText,
      redirectUri,
      hasCode: !!code,
      codeLen: code?.length ?? 0,
      hasVerifier: !!verifier,
      verifierLen: verifier?.length ?? 0,
      hasStoredState: !!storedState,
      stateMatch: state === storedState,
    }));
    const res = NextResponse.redirect(new URL("/portal?error=token_exchange_failed", req.url));
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_verifier");
    return res;
  }

  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) {
    return fail("token_exchange_failed");
  }

  // Fetch the user's profile.
  const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return fail("userinfo_failed");
  }

  const profile = (await userRes.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };

  const email = profile.email?.trim().toLowerCase();
  if (!email || !profile.email_verified) {
    return fail("email_unverified");
  }

  const name = profile.name?.trim() || email.split("@")[0];
  const providerKey = "google";

  // Upsert the user row. Existing accounts keep their password and role; we
  // only record that Google is now a linked provider.
  let user: { id: number } | undefined;
  try {
    const existing = await db
      .select({ id: users.id, providers: users.providers })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      const row = existing[0];
      const current = Array.isArray(row.providers) ? row.providers : [];
      if (!current.includes(providerKey)) {
        await db
          .update(users)
          .set({ providers: [...current, providerKey] })
          .where(and(eq(users.id, row.id), eq(users.email, email)));
      }
      user = { id: row.id };
    } else {
      const inserted = await db
        .insert(users)
        .values({
          email,
          name,
          passwordHash: null,
          providers: [providerKey],
          role: "client",
          emailVerified: new Date(),
        })
        .returning({ id: users.id });
      user = inserted[0];
    }
  } catch (err) {
    console.error("[google] user upsert failed:", err);
    return fail("upsert_failed");
  }

  if (!user) {
    return fail("upsert_failed");
  }

  // Audit log — best effort, never blocks login.
  try {
    await db.insert(loginEvents).values({
      userId: user.id,
      email,
      provider: "google",
      success: true,
      ip: req.headers.get("x-forwarded-for") ?? null,
      userAgent: req.headers.get("user-agent") ?? null,
    });
    try {
      await notifyLogin({
        email,
        name,
        provider: "google",
        ip: req.headers.get("x-forwarded-for") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
      });
    } catch {}
  } catch (err) {
    console.error("[google] login_events insert failed:", err);
  }

  // Reuse the existing session helper so cookie signing and TTL stay consistent.
  try {
    await createSession(user.id);
  } catch (err) {
    console.error("[google] createSession failed:", err);
    return fail("session_failed");
  }

  const res = NextResponse.redirect(new URL("/portal/dashboard", req.url));
  res.cookies.delete("oauth_state");
  res.cookies.delete("oauth_verifier");
  return res;
}