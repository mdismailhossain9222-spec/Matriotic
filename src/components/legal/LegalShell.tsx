import Link from "next/link";
import PageHero from "../PageHero";
import { Reveal } from "../motion/Reveal";

export type LegalSection = {
  id: string;
  heading: string;
  body: string[];
  list?: string[];
};

const TABS = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

export default function LegalShell({
  title,
  eyebrow,
  lede,
  breadcrumb,
  updated,
  sections,
  current,
}: {
  title: string;
  eyebrow: string;
  lede: string;
  breadcrumb: string;
  updated: string;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <>
      <PageHero breadcrumb={breadcrumb} eyebrow={eyebrow} title={title} lede={lede} />

      <section className="py-16 md:py-24">
        <div className="u-container">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5 border-b border-white/[0.07] pb-8">
              {TABS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 ${
                    t.href === current
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {t.label}
                </Link>
              ))}
              <span className="ml-auto text-[0.6875rem] uppercase tracking-[0.16em] text-mist">
                Last updated {updated}
              </span>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-14 lg:grid-cols-12">
            {/* TOC */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32">
                <p className="u-eyebrow">Contents</p>
                <nav aria-label="Table of contents" className="mt-6 space-y-3">
                  {sections.map((s, i) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="group flex gap-3 text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="text-[0.625rem] tracking-[0.18em] text-gold/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{s.heading}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Body */}
            <div className="lg:col-span-8 lg:col-start-5">
              <div className="space-y-14">
                {sections.map((s, i) => (
                  <Reveal key={s.id} delay={Math.min(i * 0.03, 0.2)}>
                    <article id={s.id} className="scroll-mt-32">
                      <div className="flex items-baseline gap-4">
                        <span className="text-[0.625rem] tracking-[0.2em] text-gold/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="u-display text-[1.6rem] text-white md:text-[2rem]">
                          {s.heading}
                        </h2>
                      </div>
                      <div className="mt-5 space-y-4 pl-0 md:pl-9">
                        {s.body.map((p, j) => (
                          <p key={j} className="leading-relaxed text-mist">
                            {p}
                          </p>
                        ))}
                        {s.list && (
                          <ul className="mt-4 space-y-2.5">
                            {s.list.map((item) => (
                              <li key={item} className="flex items-start gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold/70" />
                                <span className="text-[0.9375rem] leading-relaxed text-white/70">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="mt-16 rounded-sm border border-white/[0.09] bg-ink/40 p-8 md:p-10">
                  <h3 className="u-display text-xl text-white">Questions about this policy?</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    Write to our privacy team at{" "}
                    <a href="mailto:legal@matrioticstudios.com" className="u-link text-gold">
                      legal@matrioticstudios.com
                    </a>{" "}
                    or by post: Matriotic Studios LLC, 1201 Orange St,
                    Wilmington, DE 19801, United States.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
