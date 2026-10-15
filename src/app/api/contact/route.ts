import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  company: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(60).optional().default(""),
  service: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(20, "Tell us a little more — 20 characters minimum.").max(5000),
  // honeypot
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const db = getDb();
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

  return NextResponse.json({ ok: true });
}
