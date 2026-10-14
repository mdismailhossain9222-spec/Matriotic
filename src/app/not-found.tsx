import { ButtonLink } from "@/components/ui/Button";
import { ArcCluster } from "@/components/decor/GoldAssets";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90vh] min-h-[90svh] items-center overflow-hidden pt-32">
      <ArcCluster className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="u-container relative text-center">
        <p className="u-eyebrow">Error 404</p>
        <h1 className="u-display mt-6 text-[clamp(3rem,10vw,8rem)] leading-none text-white">
          Nothing <span className="u-gold-text italic">here</span>.
        </h1>
        <p className="mx-auto mt-7 max-w-md leading-relaxed text-mist">
          The page you are looking for has moved, been retired, or never existed. Let us
          point you somewhere more useful.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact the studio
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
