import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const scrypt = promisify(_scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

export const SESSION_COOKIE = "ms_session";
const SESSION_TTL_DAYS = 14;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = await scrypt(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== derived.length) return false;
  return timingSafeEqual(keyBuffer, derived);
}

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  try {
    await db.insert(sessions).values({ id, userId, expiresAt });
  } catch (err) {
    console.error("[auth] createSession failed:", err);
    throw new Error("We could not create your session. Please try again.");
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return id;
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) {
    try {
      await db.delete(sessions).where(eq(sessions.id, id));
    } catch (err) {
      console.error("[auth] destroySession failed:", err);
    }
  }
  store.delete(SESSION_COOKIE);
}

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  company: string | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        company: users.company,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) {
    // A broken session must never break the page. Treat as logged out.
    console.error("[auth] getCurrentUser failed:", err);
    return null;
  }
}