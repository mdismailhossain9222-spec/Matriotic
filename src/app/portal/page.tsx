import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import AuthPanel from "@/components/portal/AuthPanel";
import { Reveal } from "@/components/motion/Reveal";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Secure sign-in for Matriotic Studios clients - track project progress, milestones and deliverables.",
  robots: { index: false, follow: false },
};

const HIGHLIGHTS = [
  "Live project progress and milestone tracking",
  "Design reviews, assets and documentation in one place",
  "Direct line to the senior team working on your build",
  "Invoices, contracts and performance reporting",
];

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (user) redirect("/portal/dashboard");

  return (
    <section className="min-h-svh relative overflow-hidden pt-32 pb-24 md:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/portal.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="media-dim object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-obsidian/70" />
      </div>

      <div className="u-container grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="u-eyebrow">Matriotic · Secure area</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="u-display mt-6 text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] text-white">
              Your project,
              <br />
              <span className="u-gold-text italic">fully in view.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/60">
              Clients of Matriotic Studios get a private dashboard - no status-update
              emails, no guessing. Everything we are doing, visible as we do it.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h} delay={0.22 + i * 0.06} as="li">
                <div className="flex items-start gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span className="text-[0.9375rem] leading-relaxed text-white/70">{h}</span>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.5}>
            <div className="mt-12 max-w-md rounded-sm border border-gold/20 bg-gold/[0.04] p-6">
              <p className="text-[0.625rem] uppercase tracking-[0.22em] text-gold">
                Demonstration access
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Reviewing the portal? Sign in with{" "}
                <span className="font-mono text-white">demo@matrioticstudios.com</span> /{" "}
                <span className="font-mono text-white">MatrioticDemo2026</span> - or create
                your own account.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AuthPanel />
        </div>
      </div>
    </section>
  );
}
