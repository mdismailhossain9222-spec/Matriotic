"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Studio" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Journal" },
  { href: "/contact", label: "Reach Us" },
];

export default function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <header
        className={`site-header inset-x-0 top-0 z-[100] w-full transition-colors duration-500 ${
          isHome ? "fixed" : "sticky"
        } ${
          scrolled && !isHome
            ? "u-glass border-b border-white/[0.07]"
            : isHome
              ? "bg-transparent"
              : "border-b border-transparent"
        }`}
      >
        <div className="u-container flex items-center justify-between gap-6 py-5">
          <Link href="/" aria-label="Matriotic Studios — home" className="group">
            <span
              className="text-xl tracking-[0.01em] text-white transition-opacity duration-300 group-hover:opacity-80"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Matriotic<sup className="text-[0.6em]">&reg;</sup>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[0.8125rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-white/60 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Link
              href={signedIn ? "/portal/dashboard" : "/contact"}
              className="liquid-glass hidden rounded-full px-5 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-white transition-colors duration-500 hover:bg-white/[0.06] sm:inline-flex"
            >
              Begin Journey
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:border-white/40 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[95] bg-[#001f2b]/[0.98] pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="u-container flex flex-col">
              {[...NAV, { href: "/portal", label: signedIn ? "Dashboard" : "Client Portal" }].map(
                (item, i) => (
                  <motion.div
                    key={item.href + item.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between border-b border-white/[0.07] py-5"
                    >
                      <span className="text-3xl text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        {item.label}
                      </span>
                      <span className="text-[0.625rem] tracking-[0.3em] text-white/40">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.div>
                ),
              )}
              <div className="mt-10">
                <Link
                  href="/contact"
                  className="liquid-glass inline-flex rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white"
                >
                  Begin Journey
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}