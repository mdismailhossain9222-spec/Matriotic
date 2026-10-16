"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, projects } from "@/db/schema";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";

export type AuthState = { error?: string; ok?: boolean };

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z
    .string()
    .min(10, "Use at least 10 characters.")
    .regex(/[A-Za-z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

const STARTER_PROJECTS = [
  {
    name: "Brand Website — Phase 1",
    stage: "Discovery",
    progress: 15,
    summary:
      "Stakeholder interviews complete. Competitive teardown and analytics forensics in progress.",
    nextMilestone: "Architecture & sitemap sign-off",
    dueDate: "In 9 days",
  },
  {
    name: "Design System Foundations",
    stage: "Design",
    progress: 48,
    summary:
      "Type scale, colour tokens and grid defined. Component library underway in Figma.",
    nextMilestone: "Core component review",
    dueDate: "In 16 days",
  },
  {
    name: "Technical SEO Programme",
    stage: "Ongoing",
    progress: 72,
    summary:
      "Crawl budget resolved, structured data deployed, 41 redirects consolidated this month.",
    nextMilestone: "Quarterly performance report",
    dueDate: "In 24 days",
  },
];

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { name, email, password, company } = parsed.data;

  let existing: { id: number }[];
  try {
    existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  } catch (err) {
    console.error("[auth] signUp lookup failed:", err);
    return { error: "We could not check for an existing account. Please try again." };
  }
  if (existing.length > 0) {
    return { error: "An account with that email already exists. Try signing in." };
  }

  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
  } catch (err) {
    console.error("[auth] hashPassword failed:", err);
    return { error: "We could not process your password. Please try again." };
  }

  let created: { id: number } | undefined;
  try {
    [created] = await db
      .insert(users)
      .values({ name, email, company: company || null, passwordHash })
      .returning({ id: users.id });
  } catch (err) {
    console.error("[auth] signUp insert failed:", err);
    return { error: "We could not create your account. Please try again." };
  }

  if (!created) return { error: "We could not create your account. Please try again." };

  // Starter projects are best-effort — the account is still usable without them.
  try {
    await db.insert(projects).values(
      STARTER_PROJECTS.map((p) => ({ ...p, userId: created.id })),
    );
  } catch (err) {
    console.error("[auth] starter projects insert failed:", err);
  }

  try {
    await createSession(created.id);
  } catch {
    // Session creation failed but the account exists — send them to sign in.
    redirect("/portal");
  }
  redirect("/portal/dashboard");
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { email, password } = parsed.data;
  let record: { id: number; passwordHash: string } | undefined;
  try {
    [record] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  } catch (err) {
    console.error("[auth] signIn lookup failed:", err);
    return { error: "We could not check your credentials. Please try again." };
  }

  if (!record) {
    // Don't reveal whether the account exists — same message either way.
    return { error: "Those credentials do not match our records." };
  }

  let ok: boolean;
  try {
    ok = await verifyPassword(password, record.passwordHash);
  } catch (err) {
    console.error("[auth] verifyPassword failed:", err);
    return { error: "We could not verify your password. Please try again." };
  }

  if (!ok) {
    return { error: "Those credentials do not match our records." };
  }

  try {
    await createSession(record.id);
  } catch {
    return { error: "We could not create your session. Please try again." };
  }
  redirect("/portal/dashboard");
}

export async function signOutAction() {
  await destroySession();
  redirect("/portal");
}