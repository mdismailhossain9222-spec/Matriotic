import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "node:crypto";
import { db } from "@/db";
import { consentLogs } from "@/db/schema";

export const runtime = "nodejs";

const COOKIE = "ms_consent_v1";
const SIG_COOKIE = "ms_consent_sig";
const ONE_YEAR = 60 * 60 * 24 * 365;

function secret() {
  return process.env.CONSENT_SECRET ?? process.env.DATABASE_URL ?? "matriotic-consent";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const input = body as { analytics?: boolean; marketing?: boolean; region?: string };
  const preferences = {
    essential: true,
    analytics: Boolean(input?.analytics),
    marketing: Boolean(input?.marketing),
    ts: new Date().toISOString(),
    version: 1,
  };

  const token = randomBytes(16).toString("hex");
  const value = Buffer.from(JSON.stringify(preferences)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(`${token}.${value}`).digest("base64url");

  try {
    await db.insert(consentLogs).values({
      token,
      preferences: JSON.stringify(preferences),
      region: typeof input?.region === "string" ? input.region.slice(0, 16) : "unknown",
    });
  } catch {
    // consent must never block the user experience
  }

  const res = NextResponse.json({ ok: true, preferences });
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set(COOKIE, value, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: ONE_YEAR,
  });
  res.cookies.set(SIG_COOKIE, `${token}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: ONE_YEAR,
  });

  return res;
}
