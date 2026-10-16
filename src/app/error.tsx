"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h1 className="u-display mt-8 text-[clamp(1.6rem,3.4vw,2.25rem)]">
        Could not load this page
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-mist">
        A transient error stopped this page from rendering. Try again in a moment.
      </p>
      {error?.digest && (
        <p className="mt-3 font-mono text-[0.7rem] text-white/25">ref {error.digest}</p>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="u-link mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-on-gold transition-colors hover:bg-gold-soft"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Try again
      </button>
    </div>
  );
}