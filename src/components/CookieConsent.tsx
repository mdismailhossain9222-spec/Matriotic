"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Cookie, X } from "lucide-react";

const COOKIE = "ms_consent_v1";

function hasConsent() {
  if (typeof document === "undefined") return true;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hasConsent()) return;
    const t = window.setTimeout(() => setVisible(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  async function save(prefs: { analytics: boolean; marketing: boolean }) {
    setBusy(true);
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prefs,
          region: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown",
        }),
      });
    } catch {
      document.cookie = `${COOKIE}=local; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    setBusy(false);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="cookie-banner fixed bottom-4 left-4 right-4 z-[120] md:left-auto md:right-6 md:bottom-6 md:w-[26rem]"
        >
          <div className="u-glass relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl"
            />
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              aria-label="Dismiss and reject non-essential cookies"
              className="absolute right-4 top-4 text-white/30 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <Cookie className="h-4 w-4 text-gold" strokeWidth={1.6} />
              <span className="u-eyebrow">Your privacy</span>
            </div>

            <h2 className="u-display mt-4 text-xl text-white">A matter of consent.</h2>
            <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-white/60">
              We use essential cookies to run this site and optional ones to understand how it
              performs. You choose — and you can change your mind anytime. Read our{" "}
              <Link href="/legal/cookies" className="text-gold underline-offset-4 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            <AnimatePresence initial={false}>
              {custom && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-5">
                    <Row label="Strictly necessary" description="Security, sessions, load balancing." checked disabled />
                    <Row
                      label="Analytics"
                      description="Anonymous usage metrics to improve the experience."
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                    <Row
                      label="Marketing"
                      description="Attribution for campaigns. Off by default."
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  custom
                    ? save({ analytics, marketing })
                    : save({ analytics: true, marketing: true })
                }
                className="inline-flex min-h-[44px] items-center rounded-full bg-gold px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-on-gold transition-colors hover:bg-gold-soft disabled:opacity-60"
              >
                {custom ? "Save choices" : "Accept all"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => save({ analytics: false, marketing: false })}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-white/35 disabled:opacity-60"
              >
                Essential only
              </button>
              {!custom && (
                <button
                  type="button"
                  onClick={() => setCustom(true)}
                  className="px-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-mist underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  Customise
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[0.8125rem] font-medium text-white">{label}</p>
        <p className="text-[0.6875rem] leading-relaxed text-mist">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-1 h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-gold" : "bg-white/15"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-obsidian transition-all duration-300 ${
            checked ? "left-[1.125rem]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
