"use client";

/**
 * Global error boundary.
 *
 * Catches anything that escapes the per-page boundaries — a thrown redirect,
 * an unhandled module error, a render crash in the root layout. Never shows
 * a blank page: it renders a full-screen friendly state and offers a reload.
 */
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real cause to the console rather than swallowing it.
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-obsidian text-white antialiased">
        <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <h1 className="u-display mt-8 text-[clamp(1.8rem,4vw,2.75rem)]">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
            An unexpected error occurred while rendering this page. Our team has been
            notified. Your data is safe — try reloading to continue.
          </p>
          {error?.digest && (
            <p className="mt-3 font-mono text-[0.7rem] text-white/25">ref {error.digest}</p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            className="u-link mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-on-gold transition-colors hover:bg-gold-soft"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reload page
          </button>
        </div>
      </body>
    </html>
  );
}