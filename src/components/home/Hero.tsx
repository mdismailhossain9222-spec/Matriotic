export default function Hero() {
  return (
    <section
      className="relative flex min-h-svh w-full flex-col overflow-hidden"
      style={{ backgroundColor: "#001f2b" }}
    >
      {/* ── Fullscreen video backdrop ─────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />
      {/* subtle navy scrim keeps the white text legible over any frame */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,31,43,0.55) 0%, rgba(0,31,43,0.25) 45%, rgba(0,31,43,0.65) 100%)",
        }}
      />

      {/* ── Centered hero content ─────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <h1
          className="animate-fade-rise max-w-[16ch] text-[clamp(2.75rem,8vw,7rem)] leading-[1.02] text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Digital experiences with absolute precision.
        </h1>

        <p
          className="animate-fade-rise-delay mt-8 max-w-xl text-base leading-relaxed md:text-lg"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          We&apos;re designing tools for deep thinkers, bold creators, and quiet rebels.
        </p>

        <a
          href="/contact"
          className="liquid-glass animate-fade-rise-delay-2 mt-12 inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors duration-500 hover:bg-white/[0.06]"
        >
          Start a Project
        </a>
      </div>
    </section>
  );
}