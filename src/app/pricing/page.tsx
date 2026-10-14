import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";

import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { ArcCluster } from "@/components/decor/GoldAssets";
import { ButtonLink } from "@/components/ui/Button";
import { PRICING, ADDONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent starting-from pricing for custom-coded websites â€” Starter, Professional and Enterprise. Final quote depends on scope.",
};

const FAQS = [
  {
    q: "What are the payment terms?",
    a: "50% to reserve your slot and start discovery, 50% on delivery before go-live. That's it â€” no hourly surprises.",
  },
  {
    q: "Who owns the website?",
    a: "You do. After final payment you own 100% of the source code, the design files and the content. No lock-in, ever.",
  },
  {
    q: "Are hosting and domain included?",
    a: "No â€” hosting and domain costs are not included and are billed directly by the provider of your choice. We'll happily set everything up for you.",
  },
  {
    q: "How do revisions work?",
    a: "Revisions are included as per each tier: 1 round on Starter, 2 rounds on Professional, and shaped together on Enterprise with your dedicated project manager.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        breadcrumb="Pricing"
        eyebrow="Investment"
        title="Honest pricing, published in advance."
        accentFrom={3}
        lede="Every website is custom-coded by senior developers â€” React/Next.js, Node.js, custom or headless CMS. No page builders, no templates, no bloat."
      />

      {/* â”€â”€ Tiers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <ArcCluster className="pointer-events-none absolute left-1/2 top-24 h-[44rem] w-[44rem] -translate-x-1/2 opacity-30" />
        <div className="u-container relative">
          <Stagger className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {PRICING.map((tier) => (
              <StaggerItem key={tier.name} className={tier.featured ? "lg:-mt-6 lg:mb-6" : ""}>
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-sm border p-8 transition-all duration-700 md:p-10 ${
                    tier.featured
                      ? "border-gold/50 bg-gradient-to-b from-ink to-obsidian shadow-[0_30px_90px_-40px_rgba(212,162,76,0.4)]"
                      : "border-white/[0.09] bg-obsidian hover:border-white/20"
                  }`}
                >
                  {tier.featured && (
                    <>
                      <span
                        aria-hidden
                        className="deco-glow pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/10 blur-3xl"
                      />
                      <span className="absolute right-8 top-9 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.2em] text-gold">
                        Most chosen
                      </span>
                    </>
                  )}

                  <h2 className="u-display text-2xl text-white">{tier.name}</h2>
                  <p className="mt-3 min-h-[3.25rem] text-sm leading-relaxed text-mist">
                    {tier.summary}
                  </p>

                  <p className="mt-8 text-[0.625rem] uppercase tracking-[0.22em] text-gold/80">
                    Starting from
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="u-display text-2xl text-gold">$</span>
                    <span
                      className={`u-display text-5xl leading-none ${
                        tier.featured ? "u-gold-text" : "text-white"
                      }`}
                    >
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.8125rem] text-white/60">
                    {tier.range} Â· {tier.timeline}
                  </p>

                  <div className="u-hairline my-8" />

                  <ul className="flex-1 space-y-3.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tier.featured ? "text-gold" : "text-gold/60"
                          }`}
                          strokeWidth={2}
                        />
                        <span className="text-sm leading-relaxed text-white/75">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <ButtonLink
                      href="/contact"
                      variant={tier.featured ? "gold" : "outline"}
                      className="w-full"
                    >
                      {tier.cta}
                    </ButtonLink>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-12 max-w-2xl space-y-2 text-center">
              <p className="text-sm font-medium text-white/80">
                Final quote depends on scope.{" "}
                <span className="text-gold">Book a free discovery call.</span>
              </p>
              <p className="text-xs leading-relaxed text-mist">
                All prices in USD. We build with real developers using custom code
                (React/Next.js, Node.js, custom CMS or headless CMS) â€” not WordPress or page
                builders.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* â”€â”€ Add-ons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-y border-white/[0.07] bg-ink/40 py-24 md:py-32">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow">Add-ons</p>
          </Reveal>
          <SplitHeading
            text="Bolt on exactly what you need."
            accentFrom={5}
            className="u-display mt-6 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] text-white"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl leading-relaxed text-mist">
              Any of these can be added to a project or requested on their own.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {ADDONS.map((a) => (
              <StaggerItem key={a.name} className="bg-obsidian">
                <div className="group h-full p-7 transition-colors duration-500 hover:bg-ink/70 md:p-8">
                  <span className="block h-px w-8 bg-gold/50 transition-all duration-500 group-hover:w-full group-hover:bg-gold" />
                  <h3 className="u-display mt-5 text-[1.0625rem] leading-snug text-white">{a.name}</h3>
                  <p className="mt-3 text-[0.8125rem] tracking-[0.04em] text-gold/90">{a.price}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-24 md:py-36">
        <div className="u-container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="u-eyebrow">Questions</p>
            </Reveal>
            <SplitHeading
              text="The essentials, in plain terms."
              accentFrom={3}
              className="u-display mt-6 text-[clamp(1.9rem,3.6vw,2.75rem)] text-white"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 leading-relaxed text-mist">
                Anything else? Write to{" "}
                <a href="mailto:matrioticstudiollc@gmail.com" className="u-link text-gold">
                matrioticstudiollc@gmail.com
              </a>.
            </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Stagger className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {FAQS.map((f) => (
                <StaggerItem key={f.q}>
                  <details className="group py-7">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="u-display text-lg text-white transition-colors duration-300 group-open:text-gold md:text-xl">
                        {f.q}
                      </h3>
                      <span className="relative mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/12 text-gold transition-colors duration-300 group-hover:border-gold/50">
                        <Minus className="absolute h-3.5 w-3.5 rotate-90 transition-transform duration-500 group-open:rotate-0" />
                        <Minus className="absolute h-3.5 w-3.5" />
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist">{f.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* â”€â”€ Final CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] py-24 text-center md:py-32">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow">Next step</p>
          </Reveal>
          <SplitHeading
            text="Not sure which plan fits? Get a free quote in 24 hours."
            accentFrom={7}
            className="u-display mx-auto mt-6 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] text-white"
          />
          <Reveal delay={0.25}>
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/contact">Get an Estimate</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
