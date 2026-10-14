/**
 * Centralized spring constants for motion/react `useSpring`.
 *
 * Keeping these in one place means a single tuning pass adjusts every
 * scroll-linked drift in the site, and each spring carries the comment that
 * explains what it is easing. Values are intentionally "gentle" — the goal is
 * a subtle parallax, not a fight between 8 separate springs on the same frame.
 */

/** Hero backdrop image drift: 0 → 160px. */
export const HERO_BACKDROP = { stiffness: 80, damping: 28 } as const;

/** Orbit rings rotation: 0 → 140deg. */
export const ORBIT_RINGS = { stiffness: 60, damping: 24, mass: 0.6 } as const;

/** Wireframe prism drift + rotate. */
export const WIRE_PRISM = { stiffness: 70, damping: 22 } as const;

/** Generic parallax wrapper (e.g. CTA studio image). */
export const PARALLAX = { stiffness: 80, damping: 26 } as const;

/** Case-study image drift: scale boost + ±8%. */
export const CASE_STUDY = { stiffness: 80, damping: 28 } as const;