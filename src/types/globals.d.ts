import type Lenis from "lenis";

declare global {
  interface Window {
    /** Shared Lenis instance (desktop only) so the preloader can pause scroll */
    __msLenis?: Lenis;
    /** Set once the preloader has finished or was skipped */
    __msPreloaderDone?: boolean;
    /** Set by the inline script: whether the intro should play this page-load */
    __msPlShouldPlay?: boolean;
    /** Clears the DOM-level preloader failsafe (React owns the lifecycle now) */
    __msPreloaderClear?: () => void;
    /** Catastrophic-path unlock: unlocks scroll + hides the preloader */
    __msPreloaderUnlock?: () => void;
    /** DOM-level failsafe timer id */
    __msPlFail?: number;
  }
}

export {};
