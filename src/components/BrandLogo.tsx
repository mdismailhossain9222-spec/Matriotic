"use client";

import { useId } from "react";

/**
 * Matriotic Studios LLC logo — hand-built inline SVG (viewBox 0 0 440 400).
 * Pure shapes + text, zero raster. Colors resolve from CSS variables
 * (--logo-ink, --gold-1, --gold-2, --accent) so the same SVG adapts to
 * both the light and dark theme. All parts carry ids/classes for animation.
 */

const SERIF =
  "'Playfair Display', 'Playfair Display Variable', 'Cormorant Garamond', Didot, Georgia, 'Times New Roman', serif";

type mirrorFn = (x: number) => number;

const CAP: number[][] = [
  [28, 24, 100, 24, 96, 34, 32, 34], // wide flat slab
  [36, 39, 94, 39, 92, 47, 38, 47], // thinner narrower slab
];
const BASE: { x: number; y: number; w: number; h: number }[] = [
  { x: 39, y: 196, w: 48, h: 9 },
  { x: 33, y: 208, w: 60, h: 9 },
  { x: 27, y: 220, w: 72, h: 10 },
];

function Pillar({
  side,
  goldFill,
}: {
  side: "left" | "right";
  goldFill: string;
}) {
  const m: mirrorFn = (x) => (side === "right" ? 440 - x : x);
  const capSlab = (a: number[], i: number) => {
    // mirror x-pairs (reverse block order to keep winding sane)
    const pairs: [number, number][] = [];
    for (let k = 0; k < a.length; k += 2) pairs.push([m(a[k]), a[k + 1]]);
    if (side === "right") pairs.reverse();
    return <polygon key={i} points={pairs.map((p) => p.join(",")).join(" ")} />;
  };

  return (
    <g className={`pillar pillar-${side}`}>
      <g className="pillar-cap" fill={goldFill}>
        {CAP.map(capSlab)}
      </g>
      <rect style={{ fill: "var(--logo-ink)" }} x={m(side === "right" ? 45 + 37 : 45)} y={56} width={37} height={133} />
      <g className="pillar-base" fill={goldFill}>
        {BASE.map((b, i) => (
          <rect key={i} x={m(b.x + (side === "right" ? b.w : 0))} y={b.y} width={b.w} height={b.h} />
        ))}
      </g>
    </g>
  );
}

const SHIELD: string[] = [
  "134,180 161,163.1 161,191.6 134,176.7",
  "163,161.8 190,144.9 190,207.5 163,192.5",
  "192,143.7 219,126.6 219,223.5 192,208.6",
  "221,126.6 248,143.7 248,208.6 221,223.5",
  "250,144.9 277,161.8 277,192.5 250,207.5",
  "279,163.1 306,180 306,176.7 279,191.6",
];

const M_POLYS: string[] = [
  "90,196 90,62 128,62 128,196",
  "312,196 312,62 350,62 350,196",
  "128,62 166,62 220,118",
  "312,62 274,62 220,118",
];

export default function BrandLogo({
  lockup = "full",
  className = "",
}: {
  /** `full` = icon + wordmark + subtitle; `icon` = pillars + M + shield only */
  lockup?: "full" | "icon";
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox={lockup === "icon" ? "0 0 440 240" : "0 0 440 400"}
      role="img"
      aria-label="Matriotic Studios LLC logo"
      className={`brand-logo ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`brandGold-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--gold-1)" }} />
          <stop offset="100%" style={{ stopColor: "var(--gold-2)" }} />
        </linearGradient>
      </defs>

      <Pillar side="left" goldFill={`url(#brandGold-${uid})`} />
      <Pillar side="right" goldFill={`url(#brandGold-${uid})`} />

      <g className="m-letter">
        {M_POLYS.map((pts, i) => (
          <polygon key={i} style={{ fill: "var(--logo-ink)" }} points={pts} />
        ))}
      </g>

      <g className="shield">
        {SHIELD.map((pts, i) => (
          <polygon key={i} className={`shield-panel-${i + 1}`} fill={`url(#brandGold-${uid})`} points={pts} />
        ))}
      </g>

      {lockup === "full" && (
        <>
          <text
            className="wordmark"
            x={220}
            y={296}
            textAnchor="middle"
            fontFamily={SERIF}
            fontWeight={800}
            fontSize={52}
            letterSpacing={2}
            textLength={368}
            lengthAdjust="spacingAndGlyphs"
            style={{ fill: "var(--logo-ink)" }}
          >
            MATRIOTIC
          </text>
          <line className="line-left" x1={40} y1={330} x2={102} y2={330} style={{ stroke: "var(--accent)" }} strokeWidth={2} />
          <line className="line-right" x1={338} y1={330} x2={400} y2={330} style={{ stroke: "var(--accent)" }} strokeWidth={2} />
          <text
            className="subtitle"
            x={220}
            y={338}
            textAnchor="middle"
            fontFamily={SERIF}
            fontWeight={600}
            fontSize={22}
            letterSpacing={8}
            style={{ fill: "var(--accent)" }}
          >
            STUDIOS LLC
          </text>
        </>
      )}
    </svg>
  );
}
