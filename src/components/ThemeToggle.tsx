"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const KEY = "ms-theme";

function current(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    const onSystem = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(KEY)) {
          apply(e.matches ? "dark" : "light");
          setTheme(e.matches ? "dark" : "light");
        }
      } catch {
        /* no-op */
      }
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
  }

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode */
    }
  }

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === null ? "Toggle color theme" : dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      title={theme === null ? "Toggle theme" : dark ? "Light theme" : "Dark theme"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors duration-300 hover:border-gold/50 hover:text-gold ${className}`}
    >
      {dark ? (
        <Sun className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden />
      ) : (
        <Moon className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden />
      )}
    </button>
  );
}
