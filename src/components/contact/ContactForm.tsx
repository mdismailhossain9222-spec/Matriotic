"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle } from "lucide-react";
import { SubmitButton } from "../ui/Button";

const SERVICES = [
  "Custom Web Development",
  "UI/UX Design",
  "Search Optimisation",
  "Website Maintenance",
  "Not sure yet",
];

const BUDGETS = ["Under $1k", "$1k â€“ $3k", "$3k â€“ $5k", "$5k+", "Not sure yet"];

type Fields = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  website: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  company: "",
  service: SERVICES[0],
  budget: BUDGETS[1],
  message: "",
  website: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 20)
    errors.message = "Tell us a little more â€” 20 characters minimum.";
  return errors;
}

const fieldClass =
  "w-full border-b border-white/15 bg-transparent py-3.5 text-[0.9375rem] text-white outline-none transition-colors duration-300 placeholder:text-white/25 focus:border-gold";

export default function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors as Partial<Record<keyof Fields, string>>);
        setServerError(data.error ?? "Please review the highlighted fields.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setServerError("Network error. Please email matrioticstudiollc@gmail.com.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full min-h-[26rem] flex-col items-start justify-center border border-gold/25 bg-ink/50 p-10 md:p-14"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
          <Check className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <h3 className="u-display mt-8 text-3xl text-white">Message received.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-mist">
          Thank you â€” your enquiry is with us. A senior member of the studio will reply
          within one business day, usually sooner.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="u-link mt-8 text-sm uppercase tracking-[0.14em] text-gold"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <Field label="Full name" error={errors.name} htmlFor="name">
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Whitmore"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label="Email" error={errors.email} htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@company.com"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
      </div>

      <Field label="Company (optional)" htmlFor="company">
        <input
          id="company"
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Whitmore & Co."
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-9 sm:grid-cols-2">
        <Field label="Service" htmlFor="service">
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none`}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-ink text-white">
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget" htmlFor="budget">
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={(e) => update("budget", e.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none`}
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-ink text-white">
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project details" error={errors.message} htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="What are you building, who is it for, and when does it need to be live?"
          className={`${fieldClass} resize-none`}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" /> {serverError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <SubmitButton pending={status === "sending"}>Send enquiry</SubmitButton>
        <p className="max-w-xs text-xs leading-relaxed text-mist">
          Your details are encrypted in transit and never shared. See our Privacy Policy.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-[0.625rem] uppercase tracking-[0.22em] text-mist"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
