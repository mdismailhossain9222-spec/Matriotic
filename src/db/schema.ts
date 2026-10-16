import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    company: varchar("company", { length: 160 }),
    // NULL for OAuth-only accounts (Google / Facebook), which never set a
    // password. Password sign-in is rejected for these rows.
    passwordHash: text("password_hash"),
    // Role: 'user' for everyone. 'admin' is granted manually after a verified
    // Google login — never in a migration, never by email string match alone.
    role: varchar("role", { length: 16 }).notNull().default("user"),
    // Set when a provider confirms the email address is verified. NULL for
    // email/password signups (no verification flow yet) and for OAuth providers
    // that did not return a verified email.
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    // Linked OAuth providers as a Postgres text array, e.g. ["google"].
    // NULL for email/password accounts that never used OAuth.
    providers: text("providers").array().default(sql`ARRAY[]::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 180 }).notNull(),
  stage: varchar("stage", { length: 60 }).notNull().default("Discovery"),
  progress: integer("progress").notNull().default(0),
  summary: text("summary").notNull().default(""),
  nextMilestone: varchar("next_milestone", { length: 180 }).notNull().default(""),
  dueDate: varchar("due_date", { length: 40 }).notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 160 }),
  budget: varchar("budget", { length: 60 }).notNull().default(""),
  service: varchar("service", { length: 80 }).notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const consentLogs = pgTable("consent_logs", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 64 }).notNull(),
  preferences: text("preferences").notNull(),
  region: varchar("region", { length: 16 }).notNull().default("unknown"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emailOutbox = pgTable("email_outbox", {
  id: serial("id").primaryKey(),
  idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
  status: varchar("status", { length: 16 }).notNull().default("pending"), // pending | sent
  resendId: varchar("resend_id", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export const loginEvents = pgTable(
  "login_events",
  {
    id: serial("id").primaryKey(),
    // Nullable + SET NULL: a user row being deleted must not cascade-delete the
    // audit trail. user_id matches users.id type exactly (integer).
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 120 }),
    email: varchar("email", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 16 }).notNull(), // google | facebook | email
    success: boolean("success").notNull().default(true),
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("login_events_user_idx").on(t.userId),
    index("login_events_created_idx").on(t.createdAt),
    index("login_events_provider_idx").on(t.provider),
  ],
);

export const oauthStates = pgTable(
  "oauth_states",
  {
    id: serial("id").primaryKey(),
    nonce: varchar("nonce", { length: 64 }).notNull().unique(),
    provider: varchar("provider", { length: 16 }).notNull(), // google | facebook
    redirect: text("redirect").notNull(),
    // PKCE code_verifier for Google flows. NULL for Facebook (which does not
    // use PKCE). Stored so the callback can validate the challenge.
    codeVerifier: text("code_verifier"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("oauth_states_nonce_idx").on(t.nonce), index("oauth_states_created_idx").on(t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
