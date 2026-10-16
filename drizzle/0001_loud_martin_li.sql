CREATE TABLE "login_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" varchar(16) NOT NULL,
	"ip" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(16) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "providers" text;--> statement-breakpoint
ALTER TABLE "login_events" ADD CONSTRAINT "login_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "login_events_user_idx" ON "login_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "login_events_created_idx" ON "login_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "login_events_provider_idx" ON "login_events" USING btree ("provider");