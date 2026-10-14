import { SplitHeading, Reveal } from "./motion/Reveal";
import { ArcCluster } from "./decor/GoldAssets";
import Link from "next/link";

export default function PageHero({
  eyebrow,
  title,
  accentFrom,
  lede,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  accentFrom?: number;
  lede: string;
  breadcrumb: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] pt-40 pb-20 md:pt-52 md:pb-28">
      <div
        aria-hidden
        className="deco-glow pointer-events-none absolute -right-40 -top-24 h-[34rem] w-[34rem] max-w-[120vw] rounded-full bg-gold/[0.055] blur-[130px]"
      />
      <ArcCluster className="pointer-events-none absolute -right-28 top-6 h-[32rem] w-[32rem] opacity-50 md:opacity-80" />

      <div className="u-container relative">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.22em] text-mist">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-gold">{breadcrumb}</span>
          </nav>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="u-eyebrow">{eyebrow}</p>
        </Reveal>

        <SplitHeading
          as="h1"
          text={title}
          accentFrom={accentFrom}
          delay={0.12}
          className="u-display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,5.5rem)] text-white"
        />

        <Reveal delay={0.3}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">{lede}</p>
        </Reveal>
      </div>
    </section>
  );
}
