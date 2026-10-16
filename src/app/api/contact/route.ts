import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { inquiries, emailOutbox } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  company: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(60).optional().default(""),
  service: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(20, "Tell us a little more - 20 characters minimum.").max(5000),
  // honeypot
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const data = parsed.data;
  if (data.website) {
    // silently accept bot submissions
    return NextResponse.json({ ok: true });
  }

  // 1. Persist the enquiry. This is the source of truth; email is best-effort.
  try {
    await db.insert(inquiries).values({
      name: data.name,
      email: data.email,
      company: data.company || null,
      budget: data.budget,
      service: data.service,
      message: data.message,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save your message. Please email us directly." },
      { status: 500 },
    );
  }

  // 2. Notify the studio. A failure here must never surface as a form error —
  //    the enquiry is already saved and the studio can find it later.
  const idempotencyKey = `contact:${data.email}:${Date.now().toString(36)}`;
  await sendEmail({
    to: "matrioticstudiollc@gmail.com",
    subject: `New enquiry — ${data.service || "General"}`,
    html: `
      <h2>New project enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.company || "—")}</p>
      <p><strong>Service:</strong> ${escapeHtml(data.service || "—")}</p>
      <p><strong>Budget:</strong> ${escapeHtml(data.budget || "—")}</p>
      <h3>Message</h3>
      <p>${escapeHtml(data.message)}</p>
    `,
    text: `New enquiry from ${data.name} <${data.email}>\n\nService: ${data.service || "—"}\nBudget: ${data.budget || "—"}\nCompany: ${data.company || "—"}\n\n${data.message}`,
    tags: [{ name: "type", value: "enquiry" }],
    idempotencyKey,
  }).catch((err) => {
    console.error("[contact] email send failed:", err);
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Drain the email outbox. Called by a cron (see Vercel config) or manually. */
export async function GET() {
  const { flushOutbox } = await import("@/lib/email");
  const result = await flushOutbox();
  return NextResponse.json({ ok: true, ...result });
}