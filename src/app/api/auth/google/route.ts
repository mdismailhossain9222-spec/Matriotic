import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/auth/google
 *
 * Generates a random state and a PKCE (verifier + S256 challenge), stores them
 * in httpOnly cookies on the redirect response, and redirects the browser to
 * Google's OAuth consent screen. PKCE protects the authorization-code exchange
 * against CSRF even when the client_secret cannot be kept secret in the browser.
 */
export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`google-auth:${ip}`, 10, 60_000)) {
    return NextResponse.redirect(
      new URL("/portal?error=rate_limited", request.url),
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/portal?error=missing_client_id", request.url),
    );
  }

  const state = randomBytes(32).toString("hex");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });

  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("oauth_verifier", verifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 600,
  });
  return res;
}