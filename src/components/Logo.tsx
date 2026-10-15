import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="Matriotic Studios LLC - home" className="group flex items-center gap-3.5">
      <BrandLogo
        lockup="icon"
        className="h-11 w-auto shrink-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
      />
      <span className="flex flex-col leading-none">
        <span className="u-display text-[1.0625rem] tracking-[0.01em] text-white">
          Matriotic
        </span>
        {!compact && (
          <span className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.32em] text-mist">
            Studios LLC
          </span>
        )}
      </span>
    </Link>
  );
}
