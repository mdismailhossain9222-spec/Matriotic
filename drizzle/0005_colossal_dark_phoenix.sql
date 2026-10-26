CREATE TABLE "email_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"campaign_id" integer,
	"step" integer DEFAULT 1 NOT NULL,
	"kind" varchar(32) DEFAULT 'sequence' NOT NULL,
	"to_email" varchar(255) NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"provider" varchar(32),
	"message_id" varchar(255),
	"error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(120),
	"last_name" varchar(120),
	"company" varchar(160),
	"title" varchar(120),
	"phone" varchar(64),
	"linkedin_url" varchar(500),
	"status" varchar(32) DEFAULT 'New' NOT NULL,
	"email_status" varchar(32) DEFAULT 'verified' NOT NULL,
	"source" varchar(64),
	"source_url" varchar(500),
	"personalization_notes" text,
	"score" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_logs_lead_idx" ON "email_logs" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "email_logs_status_idx" ON "email_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_logs_created_idx" ON "email_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_company_idx" ON "leads" USING btree ("company");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");