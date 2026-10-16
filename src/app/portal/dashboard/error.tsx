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
    console.error("[dashboard-error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start gap-3 rounded-sm border border-red-500/30 bg-red-500/5 px-6 py-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        <div>
          <h2 className="u-display text-xl text-white">Could not load the dashboard</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            We could not fetch your projects. Your data is safe — retry when you are
            ready.
          </p>
          {error?.digest && (
            <p className="mt-2 font-mono text-[0.7rem] text-white/25">ref {error.digest}</p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            className="u-link mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-gold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      </div>
    </div>
  );
}