"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { SOCIAL_LINKS, SOCIAL_PROPS } from "./SocialIcons";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Get an Estimate" },
];

const SOCIALS = SOCIAL_LINKS;

export default function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  // IntersectionObserver instead of a scroll listener: a 1px sentinel at the
  // top of the page flips `scrolled` when it leaves the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { root: null, rootMargin: "-24px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <span ref={sentinelRef} aria-hidden className="pointer-events-none fixed top-0 left-0 h-px w-px opacity-0" />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={`site-header fixed inset-x-0 top-0 z-[100] transition-transform duration-500 gpu ${
          scrolled || open
            ? "u-glass border-b border-white/[0.07] py-3"
            : "border-b border-transparent py-5"
        }`}
      >
        <div className="u-container flex items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[0.8125rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${
                    active ? "text-gold" : "text-white/65 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1.5 xl:flex">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...SOCIAL_PROPS}
                  aria-label={`Matriotic Studios on ${label}`}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/40 transition-colors duration-300 hover:text-gold"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
              <span className="mx-1.5 h-5 w-px bg-white/10" />
            </div>

            <ThemeToggle />

            <Link
              href="/portal"
              className="group relative hidden overflow-hidden rounded-full border border-gold/40 px-5 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-gold transition-colors duration-500 hover:text-on-gold sm:inline-flex"
            >
              <span className="absolute inset-0 -z-0 translate-y-full bg-gold transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">{signedIn ? "Dashboard" : "Client Portal"}</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:border-gold/50 hover:text-gold lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[95] bg-obsidian/[0.98] pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="u-container flex flex-col">
              {[...NAV, { href: "/portal", label: signedIn ? "Dashboard" : "Client Portal" }].map(
                (item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between border-b border-white/[0.07] py-5"
                    >
                      <span className="u-display text-3xl text-white">{item.label}</span>
                      <span className="text-[0.625rem] tracking-[0.3em] text-gold/70">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.div>
                ),
              )}
              <div className="mt-10 flex items-center gap-6">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...SOCIAL_PROPS}
                    aria-label={`Matriotic Studios on ${label}`}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-white/50 hover:text-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
                <span className="h-5 w-px bg-white/10" />
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
