import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14.5 8.5h2.2V5.6c-.38-.05-1.69-.17-3.21-.17-3.18 0-5.36 1.9-5.36 5.4v2.3H5.4v3.26h2.73V24h3.35v-7.6h2.72l.42-3.27h-3.14v-1.98c0-.95.26-1.6 1.62-1.6Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.9 21h4.18V9.5H2.9V21Zm7.1 0h4.17v-6.2c0-1.64.31-3.22 2.34-3.22 2 0 2.03 1.87 2.03 3.33V21H22.7v-6.93c0-3.6-.78-6.37-4.98-6.37-2.02 0-3.38 1.11-3.93 2.16h-.06V9.5H10V21Z" />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/profile.php?id=61594161274028",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://instagram.com/matriotic.studios.llc?srtk=bGVlcDlrd2VmbjBn",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.linkedin.com/company/matriotic-studios-llc/about/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
] as const;

/** Spread onto every social <a> — opens off-site in a new tab, safely. */
export const SOCIAL_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
