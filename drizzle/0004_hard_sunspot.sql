--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_states" (
        "id" serial PRIMARY KEY NOT NULL,
        "nonce" varchar(64) NOT NULL,
        "provider" varchar(16) NOT NULL,
        "redirect" text NOT NULL,
        "code_verifier" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "oauth_states_nonce_unique" UNIQUE("nonce")
);
--> statement-breakpoint
ALTER TABLE "login_events" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "providers" SET DATA TYPE text[] USING (CASE WHEN "providers" IS NULL OR "providers" = '' THEN ARRAY[]::text[] ELSE ARRAY["providers"] END);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "providers" SET DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "login_events" ADD COLUMN IF NOT EXISTS "success" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "oauth_states_nonce_idx" ON "oauth_states" USING btree ("nonce");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "oauth_states_created_idx" ON "oauth_states" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "oauth_states" ENABLE ROW LEVEL SECURITY;