export default function AdminLoading() {
  return (
    <section className="min-h-svh pt-36 pb-24">
      <div className="u-container space-y-8">
        <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
        <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-obsidian p-7">
              <div className="h-7 w-16 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-sm border border-white/[0.09] bg-ink/40" />
      </div>
    </section>
  );
}