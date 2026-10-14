"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Lock, ShieldCheck } from "lucide-react";

import { signInAction, signUpAction, type AuthState } from "@/app/portal/actions";

const initial: AuthState = {};

const fieldClass =
  "w-full border-b border-white/15 bg-transparent py-3.5 text-[0.9375rem] text-white outline-none transition-colors duration-300 placeholder:text-white/25 focus:border-gold";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative mt-10 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gold px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-on-gold transition-opacity disabled:opacity-60"
    >
      <span className="absolute inset-0 translate-y-full bg-gold-soft transition-transform duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
      <span className="relative z-10">{pending ? "Please wait…" : label}</span>
    </button>
  );
}

export default function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signIn] = useActionState(signInAction, initial);
  const [signUpState, signUp] = useActionState(signUpAction, initial);

  const state = mode === "signin" ? signInState : signUpState;

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative overflow-hidden rounded-sm border border-white/[0.09] bg-ink/70 p-8 backdrop-blur-xl md:p-11">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        />

        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-gold" strokeWidth={1.6} />
          <span className="u-eyebrow">Client portal</span>
        </div>

        <h1 className="u-display mt-5 text-[clamp(1.9rem,4vw,2.75rem)] text-white">
          {mode === "signin" ? "Welcome back." : "Create your access."}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          {mode === "signin"
            ? "Sign in to review project progress, milestones and deliverables."
            : "Set up a secure account to follow your engagement in real time."}
        </p>

        {/* tabs */}
        <div className="relative mt-9 grid grid-cols-2 rounded-full border border-white/10 p-1">
          <motion.span
            aria-hidden
            className="absolute inset-y-1 left-0 w-1/2 rounded-full bg-gold will-change-transform"
            style={{ translateX: "0.25rem" }}
            animate={{ x: mode === "signin" ? "0%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`relative z-10 rounded-full py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                mode === m ? "text-on-gold" : "text-white/55 hover:text-white"
              }`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {mode === "signin" ? (
              <form action={signIn} className="mt-9 space-y-7">
                <Labelled label="Email" htmlFor="si-email">
                  <input
                    id="si-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </Labelled>
                <Labelled label="Password" htmlFor="si-password">
                  <input
                    id="si-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    className={fieldClass}
                  />
                </Labelled>
                <Error message={state.error} />
                <Submit label="Enter the portal" />
              </form>
            ) : (
              <form action={signUp} className="mt-9 space-y-7">
                <Labelled label="Full name" htmlFor="su-name">
                  <input
                    id="su-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jane Whitmore"
                    className={fieldClass}
                  />
                </Labelled>
                <Labelled label="Company (optional)" htmlFor="su-company">
                  <input
                    id="su-company"
                    name="company"
                    autoComplete="organization"
                    placeholder="Whitmore & Co."
                    className={fieldClass}
                  />
                </Labelled>
                <Labelled label="Email" htmlFor="su-email">
                  <input
                    id="su-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </Labelled>
                <Labelled
                  label="Password"
                  htmlFor="su-password"
                  hint="Minimum 10 characters, with a number."
                >
                  <input
                    id="su-password"
                    name="password"
                    type="password"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    placeholder="••••••••••"
                    className={fieldClass}
                  />
                </Labelled>
                <Error message={state.error} />
                <Submit label="Create secure account" />
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-9 flex items-start gap-3 border-t border-white/[0.07] pt-7">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
          <p className="text-[0.6875rem] leading-relaxed text-mist">
            Passwords are salted and hashed with scrypt. Sessions use signed, HTTP-only
            cookies with SameSite protection and expire after 14 days.
          </p>
        </div>
      </div>
    </div>
  );
}

function Labelled({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[0.625rem] uppercase tracking-[0.22em] text-mist">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-2 text-[0.6875rem] text-white/30">{hint}</p>}
    </div>
  );
}

function Error({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          className="flex items-start gap-2 text-sm text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
