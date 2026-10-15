import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { ArrowUpRight, CalendarDays, LogOut } from "lucide-react";

import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "../actions";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import ProgressBar from "@/components/portal/ProgressBar";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/portal");

  const db = getDb();
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(asc(projects.id));

  const average =
    rows.length > 0
      ? Math.round(rows.reduce((sum, r) => sum + r.progress, 0) / rows.length)
      : 0;

  return (
    <section className="min-h-svh relative pt-36 pb-24 md:pt-44">
      <div
        aria-hidden
        className="deco-glow pointer-events-none absolute -top-20 left-1/2 h-96 w-[55rem] max-w-[100vw] -translate-x-1/2 rounded-full bg-gold/[0.055] blur-[130px]"
      />
      <div className="u-container relative">
        <div className="flex flex-col justify-between gap-8 border-b border-white/[0.07] pb-10 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="u-eyebrow">Client dashboard</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="u-display mt-5 text-[clamp(2rem,4.6vw,3.25rem)] text-white">
                Good to see you, <span className="u-gold-text italic">{user.name.split(" ")[0]}</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-3 text-sm text-mist">
                {user.company ? `${user.company} · ` : ""}
                {user.email}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/12 px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70 transition-colors duration-500 hover:border-gold/50 hover:text-gold"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
                Sign out
              </button>
            </form>
          </Reveal>
        </div>

        {/* Summary strip */}
        <Stagger className="mt-12 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          {[
            { value: String(rows.length), label: "Active engagements" },
            { value: `${average}%`, label: "Average completion" },
            { value: "1 bd", label: "Typical response time" },
          ].map((s) => (
            <StaggerItem key={s.label} className="bg-obsidian p-7">
              <p className="u-display text-4xl u-gold-text">{s.value}</p>
              <p className="mt-2 text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Projects */}
        <h2 className="u-display mt-16 text-2xl text-white">Your projects</h2>

        {rows.length === 0 ? (
          <p className="mt-6 text-mist">
            No projects assigned yet. Your client partner will add them shortly.
          </p>
        ) : (
          <Stagger className="mt-8 space-y-5">
            {rows.map((p) => (
              <StaggerItem key={p.id}>
                <article className="group relative overflow-hidden rounded-sm border border-white/[0.09] bg-ink/40 p-7 transition-colors duration-500 hover:border-gold/25 md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <span className="rounded-full border border-gold/30 px-3 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-gold">
                        {p.stage}
                      </span>
                      <h3 className="u-display mt-4 text-2xl text-white">{p.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="u-display text-3xl text-white">{p.progress}%</p>
                      <p className="text-[0.625rem] uppercase tracking-[0.16em] text-mist">
                        complete
                      </p>
                    </div>
                  </div>

                  <ProgressBar value={p.progress} />

                  <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist">{p.summary}</p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 text-sm">
                    <span className="flex items-center gap-2.5 text-white/75">
                      <ArrowUpRight className="h-4 w-4 text-gold" strokeWidth={1.6} />
                      Next: {p.nextMilestone}
                    </span>
                    <span className="flex items-center gap-2.5 text-mist">
                      <CalendarDays className="h-4 w-4 text-gold/70" strokeWidth={1.6} />
                      {p.dueDate}
                    </span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-sm border border-white/[0.07] bg-gradient-to-r from-ink to-obsidian p-8 md:p-10">
            <div>
              <h3 className="u-display text-xl text-white">Need something changed?</h3>
              <p className="mt-2 text-sm text-mist">
                Message your client partner directly — we reply within one business day.
              </p>
            </div>
            <a
              href="mailto:hello@matrioticstudios.com"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-on-gold transition-colors hover:bg-gold-soft"
            >
              Contact the studio
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
