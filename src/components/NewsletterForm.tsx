"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setState(valid ? "done" : "error");
    if (valid) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="w-full lg:max-w-md lg:justify-self-end" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-3 border-b border-white/15 pb-3 transition-colors focus-within:border-gold/70">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="your@email.com"
          autoComplete="email"
          className="w-full bg-transparent text-[0.9375rem] text-white outline-none placeholder:text-white/30"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-500 hover:bg-gold hover:text-on-gold"
        >
          {state === "done" ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      <p
        className={`mt-2.5 text-xs transition-opacity ${
          state === "error" ? "text-red-400" : state === "done" ? "text-gold" : "text-mist/0"
        }`}
        role="status"
      >
        {state === "error"
          ? "Please enter a valid email address."
          : state === "done"
            ? "You're on the list. Welcome aboard."
            : "placeholder"}
      </p>
    </form>
  );
}
