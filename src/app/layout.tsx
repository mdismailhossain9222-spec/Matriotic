import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import GrainOverlay from "@/components/GrainOverlay";
import { getCurrentUser } from "@/lib/auth";

// Google Fonts with self-hosting via next/font/google — zero CLS via size-adjusted
// fallback metrics + font-display: swap + preload. Subset to latin for performance.
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
  fallback: ["Georgia", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matrioticstudios.com"),
  title: {
    default: "Matriotic Studios LLC — Premium Web Development & Design",
    template: "%s · Matriotic Studios",
  },
  description:
    "Matriotic Studios LLC is a boutique web development agency crafting meticulous, high-performance digital experiences for ambitious brands.",
  keywords: [
    "web development agency",
    "luxury web design",
    "UI UX design",
    "Next.js agency",
    "SEO",
    "website maintenance",
  ],
  openGraph: {
    title: "Matriotic Studios LLC — Premium Web Development & Design",
    description:
      "A boutique studio crafting meticulous, high-performance digital experiences for ambitious brands.",
    type: "website",
    siteName: "Matriotic Studios LLC",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-obsidian text-white antialiased">
        {/* Pre-paint: theme + preloader skip/scroll-lock + DOM-level 4s failsafe (works even if the framework fails) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement,e;try{e=localStorage.getItem('ms-theme')}catch(x){e=null}d.dataset.theme=e||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var seen=true;try{seen=sessionStorage.getItem('ms_preloader_seen')==='1'}catch(x){}try{if(!seen)sessionStorage.setItem('ms_preloader_seen','1')}catch(x){}window.__msPlShouldPlay=!seen;var unlock=function(){try{clearTimeout(window.__msPlFail)}catch(x){}d.classList.add('pl-skip');try{window.__msPreloaderDone=true;window.dispatchEvent(new Event('ms:preloader-done'))}catch(x){}};if(seen){d.classList.add('pl-skip');window.__msPreloaderDone=true}else{window.__msPlFail=setTimeout(unlock,4000)}window.__msPreloaderUnlock=unlock;window.__msPreloaderClear=function(){try{clearTimeout(window.__msPlFail)}catch(x){}}})()",
          }}
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".preloader{display:none!important}body [style]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;animation:none!important}",
            }}
          />
        </noscript>
        <Preloader />
        <SmoothScroll />
        <GrainOverlay />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-gold"
        >
          Skip to content
        </a>
        <SiteHeader signedIn={Boolean(user)} />
        <main id="main" className="relative">
          {children}
        </main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
