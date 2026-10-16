/**
 * Validated environment variables.
 *
 * Fails fast at first import with a clear, actionable message rather than
 * letting a misconfigured deployment fail deep inside a database call.
 */
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Database. Two URLs because Supabase offers two poolers:
  //   DATABASE_URL         → session pooler (port 5432), used by drizzle-kit
  //   DATABASE_URL_POOLED  → transaction pooler (port 6543), used at runtime
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
  DATABASE_URL_POOLED: z.string().url().optional().describe("Transaction pooler for runtime"),

  // Auth / consent
  CONSENT_SECRET: z.string().min(16).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://matrioticstudios.com"),

  // Contact form (Web3Forms is optional — the form works without it)
  WEB3FORMS_ACCESS_KEY: z.string().optional(),

  // Cloudflare R2 (optional — images fall back to local /public assets)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),

  // Resend transactional email (optional — forms still record in the DB)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional().default("hello@matrioticstudios.com"),
  RESEND_FROM_NAME: z.string().optional().default("Matriotic Studios"),

  // OAuth providers (optional — social login is disabled without them)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),

  // Admin / cron auth
  ADMIN_EMAIL: z.string().email().optional().default("matrioticstudiollc@gmail.com"),
  CRON_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
  }
  return parsed.data;
}

export const env = parseEnv();