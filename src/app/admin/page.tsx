import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { and, desc, eq, gte, count } from "drizzle-orm";
import { Zap } from "lucide-react";

import { db } from "@/db";
import { inquiries, loginEvents, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "../portal/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Server-rendered admin dashboard.
 *
 * Gated twice:
 * 1. Must have a valid session cookie (`getCurrentUser()`).
 * 2. The session user must have `role === 'admin'` AND `emailVerified !== null`.
 *
 * If either condition fails, renders a 403 screen. Never shows data to unauthorized users.
 */
export default async function AdminPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/portal");

  // Verify role and verification status directly against the DB.
  let adminRow: { id: number; email: string; role: string; emailVerified: Date | null } | undefined;
  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);
    adminRow = rows[0];
  } catch (err) {
    console.error("[admin] role lookup failed:", err);
    return <Forbidden message="Database error while verifying access." />;
  }

  if (!adminRow || adminRow.role !== "admin" || !adminRow.emailVerified) {
    return <Forbidden message="You do not have administrative privileges." />;
  }

  // --- STATS ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let totalUsers = 0;
  let loginsLast7Days = 0;
  let totalInquiries = 0;

  try {
    const [uCount] = await db.select({ value: count() }).from(users);
    const [lCount] = await db
      .select({ value: count() })
      .from(loginEvents)
      .where(gte(loginEvents.createdAt, sevenDaysAgo));
    const [iCount] = await db.select({ value: count() }).from(inquiries);

    totalUsers = uCount?.value ?? 0;
    loginsLast7Days = lCount?.value ?? 0;
    totalInquiries = iCount?.value ?? 0;
  } catch (err) {
    console.error("[admin] stats query failed:", err);
  }

  // --- RECENT DATA ---
  let recentUsers: (typeof users.$inferSelect)[] = [];
  let recentLogins: (typeof loginEvents.$inferSelect)[] = [];
  let recentInquiries: (typeof inquiries.$inferSelect)[] = [];

  try {
    recentUsers = await db.select().from(users).orderBy(desc(users.id)).limit(50);
  } catch (err) {
    console.error("[admin] recentUsers query failed:", err);
  }

  try {
    recentLogins = await db
      .select()
      .from(loginEvents)
      .orderBy(desc(loginEvents.id))
      .limit(100);
  } catch (err) {
    console.error("[admin] recentLogins query failed:", err);
  }

  try {
    recentInquiries = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.id))
      .limit(50);
  } catch (err) {
    console.error("[admin] recentInquiries query failed:", err);
  }

  return (
    <section className="min-h-svh pt-32 pb-24 md:pt-40">
      <div className="u-container space-y-14">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.07] pb-8 md:flex-row md:items-end">
          <div>
            <p className="u-eyebrow">Studio administration</p>
            <h1 className="u-display mt-4 text-[clamp(2rem,4vw,3rem)] text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-mist">
              Signed in as <span className="text-white">{adminRow.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/live-dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-gold hover:bg-gold/20 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" strokeWidth={1.6} />
              Live Outreach Dashboard
            </Link>
            <Link
              href="/portal/dashboard"
              className="text-xs uppercase tracking-[0.14em] text-gold hover:underline"
            >
              Client dashboard →
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/12 px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Section 1: Stats */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Overview</h2>
          <div className="mt-4 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
            <div className="bg-obsidian p-7">
              <p className="u-display text-4xl u-gold-text">{totalUsers}</p>
              <p className="mt-2 text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                Total users
              </p>
            </div>
            <div className="bg-obsidian p-7">
              <p className="u-display text-4xl u-gold-text">{loginsLast7Days}</p>
              <p className="mt-2 text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                Logins (last 7 days)
              </p>
            </div>
            <div className="bg-obsidian p-7">
              <p className="u-display text-4xl u-gold-text">{totalInquiries}</p>
              <p className="mt-2 text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                Total inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Recent Users */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
              Recent Users (last {recentUsers.length})
            </h2>
            <ExportLink type="users" />
          </div>
          <div className="overflow-x-auto rounded-sm border border-white/[0.09] bg-ink/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.07] text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Verified</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-mist">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono text-white/50">{u.id}</td>
                      <td className="p-3.5 font-medium text-white">{u.email}</td>
                      <td className="p-3.5 text-white/70">{u.name}</td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
                            u.role === "admin"
                              ? "border border-gold/40 text-gold"
                              : "border border-white/10 text-white/60"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {u.emailVerified ? (
                          <span className="text-emerald-400">Yes</span>
                        ) : (
                          <span className="text-white/30">No</span>
                        )}
                      </td>
                      <td className="p-3.5 text-mist">
                        {new Date(u.createdAt).toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recent Logins */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
              Recent Logins (last {recentLogins.length})
            </h2>
            <ExportLink type="logins" />
          </div>
          <div className="overflow-x-auto rounded-sm border border-white/[0.09] bg-ink/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.07] text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">IP</th>
                  <th className="p-3.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {recentLogins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-mist">
                      No login events recorded.
                    </td>
                  </tr>
                ) : (
                  recentLogins.map((l) => (
                    <tr key={l.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono text-white/50">{l.id}</td>
                      <td className="p-3.5 text-white">{l.email}</td>
                      <td className="p-3.5 uppercase tracking-wider text-white/70">
                        {l.provider}
                      </td>
                      <td className="p-3.5">
                        {l.success ? (
                          <span className="text-emerald-400">Success</span>
                        ) : (
                          <span className="text-rose-400">Failed</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-mist" title={l.userAgent ?? undefined}>
                        {l.ip ?? "unknown"}
                      </td>
                      <td className="p-3.5 text-mist">
                        {new Date(l.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Inquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
              Inquiries (last {recentInquiries.length})
            </h2>
            <ExportLink type="inquiries" />
          </div>
          <div className="overflow-x-auto rounded-sm border border-white/[0.09] bg-ink/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.07] text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Message</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {recentInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-mist">
                      No inquiries yet.
                    </td>
                  </tr>
                ) : (
                  recentInquiries.map((i) => (
                    <tr key={i.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono text-white/50">{i.id}</td>
                      <td className="p-3.5 text-white">{i.name}</td>
                      <td className="p-3.5 text-white/70">{i.email}</td>
                      <td className="p-3.5 text-mist">{i.company ?? "—"}</td>
                      <td className="p-3.5 text-white/70">{i.service || "—"}</td>
                      <td
                        className="max-w-xs truncate p-3.5 text-mist"
                        title={i.message}
                      >
                        {i.message}
                      </td>
                      <td className="p-3.5 text-mist">
                        {new Date(i.createdAt).toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExportLink({ type }: { type: "users" | "logins" | "inquiries" }) {
  return (
    <a
      href={`/api/admin/export?type=${type}`}
      download
      className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold hover:underline"
    >
      Export CSV ↓
    </a>
  );
}

function Forbidden({ message }: { message: string }) {
  return (
    <section className="min-h-svh flex items-center justify-center pt-32 pb-24">
      <div className="mx-auto max-w-md rounded-sm border border-white/[0.09] bg-ink/70 p-8 text-center backdrop-blur-xl md:p-11">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-rose-400">
          403 — Access denied
        </p>
        <h1 className="u-display mt-4 text-2xl text-white">Administrative area</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">{message}</p>
        <div className="mt-8">
          <Link
            href="/portal"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-on-gold hover:bg-gold-soft"
          >
            Return to portal
          </Link>
        </div>
      </div>
    </section>
  );
}