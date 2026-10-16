--> statement-breakpoint
-- Enable Row Level Security on every table in the public schema.
-- The app connects via the direct Postgres role (DATABASE_URL), which bypasses
-- RLS, so the app keeps working. The Supabase anon API cannot read any of these
-- tables because there are no policies granting it access.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consent_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_outbox" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "login_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
-- drizzle_migrations is created by drizzle-kit during the first migrate run.
-- Enable it too if it exists, so the tracking table is not readable via the
-- anon API (it would otherwise leak migration history).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'drizzle_migrations') THEN
    EXECUTE 'ALTER TABLE "drizzle_migrations" ENABLE ROW LEVEL SECURITY';
  END IF;
END
$$;
--> statement-breakpoint
-- Explicitly deny the anon role. RLS is already on with no policies, which means
-- a default-deny for non-superusers, but making it explicit is clearer.
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "sessions" FORCE ROW LEVEL SECURITY;
ALTER TABLE "projects" FORCE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" FORCE ROW LEVEL SECURITY;
ALTER TABLE "consent_logs" FORCE ROW LEVEL SECURITY;
ALTER TABLE "email_outbox" FORCE ROW LEVEL SECURITY;
ALTER TABLE "login_events" FORCE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'drizzle_migrations') THEN
    EXECUTE 'ALTER TABLE "drizzle_migrations" FORCE ROW LEVEL SECURITY';
  END IF;
END
$$;