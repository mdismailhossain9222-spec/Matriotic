"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "gold" | "ghost" | "outline";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors duration-500";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-on-gold hover:text-on-gold",
  ghost: "text-white/80 hover:text-white",
  outline: "border border-white/15 text-white hover:border-gold/60",
};

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {arrow ? (
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.6}
          />
        ) : null}
      </span>
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "gold",
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-0 z-0 translate-y-full transition-transform duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 ${
          variant === "gold" ? "bg-gold-soft" : "bg-gold"
        }`}
      />
      <span
        className={`relative z-10 flex items-center gap-2 transition-colors duration-500 ${
          variant === "gold" ? "" : "group-hover:text-on-gold"
        }`}
      >
        <Inner arrow={arrow}>{children}</Inner>
      </span>
    </Link>
  );
}

export function SubmitButton({
  children,
  pending,
  className = "",
}: {
  children: ReactNode;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} bg-gold text-on-gold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 z-0 translate-y-full bg-gold-soft transition-transform duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
      />
      <span className="relative z-10 flex items-center gap-2">
        {pending ? "Sending…" : children}
      </span>
    </button>
  );
}
