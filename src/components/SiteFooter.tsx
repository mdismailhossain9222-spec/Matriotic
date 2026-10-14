import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { SOCIAL_LINKS, SOCIAL_PROPS } from "./SocialIcons";
import NewsletterForm from "./NewsletterForm";

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/services", label: "Services" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { href: "/services#development", label: "Custom Web Development" },
      { href: "/services#design", label: "UI/UX Design" },
      { href: "/services#seo", label: "Search Optimisation" },
      { href: "/services#care", label: "Website Maintenance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/cookies", label: "Cookie Policy" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-white/[0.07] bg-obsidian">
      <div
        aria-hidden
        className="deco-glow pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] max-w-[100vw] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]"
      />
      <div className="u-container relative py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" aria-label="Matriotic Studios LLC — home" className="inline-block">
              <BrandLogo className="h-auto w-44" />
            </Link>
            <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed text-mist">
              A boutique digital studio engineering considered, high-performance web
              experiences for brands that refuse to blend in.
            </p>
            <div className="mt-8 space-y-2 text-sm">
              <a
                href="mailto:matrioticstudiollc@gmail.com"
                className="u-link block text-white/80 hover:text-gold"
              >
                matrioticstudiollc@gmail.com
              </a>
              <p className="pt-2 text-mist">Mirpur DOHS, Dhaka</p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...SOCIAL_PROPS}
                  aria-label={`Matriotic Studios on ${label}`}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-500 hover:border-gold/50 hover:text-gold"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="u-eyebrow">{col.title}</h3>
                <ul className="mt-6 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="text-[0.9375rem] text-white/60 transition-colors duration-300 hover:text-gold"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-white/[0.07] pt-10 lg:grid-cols-[1.4fr_2fr] lg:items-center">
          <div>
            <h3 className="u-display text-xl text-white">The Dispatch</h3>
            <p className="mt-2 text-sm text-mist">
              Quarterly notes on craft, performance and conversion. No noise.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-8 text-xs text-mist md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Matriotic Studios LLC. All rights reserved.</p>
          <p className="tracking-[0.18em] uppercase">
            Designed &amp; engineered in Delaware, USA
          </p>
        </div>
      </div>
    </footer>
  );
}
