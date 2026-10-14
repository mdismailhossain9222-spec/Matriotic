import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    company: varchar("company", { length: 160 }),
    passwordHash: text("password_hash").notNull(),
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

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
