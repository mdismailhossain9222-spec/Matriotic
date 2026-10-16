import type { VercelConfig } from "@vercel/config/v1";

/**
 * Vercel project configuration (vercel.ts).
 *
 * - Cron: drain the email outbox daily so queued sends (from Resend 429s or
 *   transient failures) get retried instead of piling up.
 * - Headers: cache static assets aggressively; let Next.js Image routes
 *   revalidate so they can be purged on deploy.
 */
export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  installCommand: "npm install",
  crons: [
    {
      // GET /api/contact drains the email outbox (queued sends from Resend
      // 429s or transient failures). Runs daily at 08:00 UTC.
      path: "/api/contact",
      schedule: "0 8 * * *",
    },
  ],
  headers: [
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
};