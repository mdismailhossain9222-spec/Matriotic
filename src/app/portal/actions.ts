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

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return { error: "An account with that email already exists. Try signing in." };
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({ name, email, company: company || null, passwordHash })
    .returning({ id: users.id });

  if (!created) return { error: "We could not create your account. Please try again." };

  await db.insert(projects).values(
    STARTER_PROJECTS.map((p) => ({ ...p, userId: created.id })),
  );

  await createSession(created.id);
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
  const [record] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!record || !(await verifyPassword(password, record.passwordHash))) {
    return { error: "Those credentials do not match our records." };
  }

  await createSession(record.id);
  redirect("/portal/dashboard");
}

export async function signOutAction() {
  await destroySession();
  redirect("/portal");
}
