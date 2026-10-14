import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/images";
mkdirSync(OUT, { recursive: true });
const GOLD = "#D4A24C";
const GOLD_D = "#A67A2E";
const BG = "#0E0E0E";

// Build a brand-style artwork SVG and rasterize it to WebP.
function make(name, w, h, glowX, glowY, lines) {
  const stops = lines
    .map((l) => `<stop offset="${l.offset}" stop-color="${l.color}" stop-opacity="${l.opacity}"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="g" cx="${glowX}" cy="${glowY}" r="${glowY * 1.6}">
        <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.30"/>
        <stop offset="45%" stop-color="${GOLD}" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${GOLD}"/>
        <stop offset="100%" stop-color="${GOLD_D}"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <rect width="${w}" height="${h}" fill="${BG}"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${lines.map((l) => `<rect x="${l.x}" y="0" width="${l.width}" height="${h}" fill="url(#lg)" opacity="${l.opacity}"/>`).join("")}
    <rect y="${h - 2}" width="${w}" height="2" fill="url(#lg)" opacity="0.5"/>
  </svg>`;

  sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 80 }).toFile(`${OUT}/${name}`, { format: "webp" });
}

const L = (x, width, opacity) => ({ x, width, opacity });

make("hero.jpg", 1920, 1080, 0.62, 0.55, [L(120, 2, 0.30), L(320, 2, 0.18), L(700, 2, 0.24), L(1150, 2, 0.14), L(1500, 2, 0.22), L(1760, 2, 0.16)]);
make("work-1.jpg", 1280, 960, 0.30, 0.42, [L(140, 2, 0.28), L(520, 2, 0.16), L(900, 2, 0.22), L(1120, 2, 0.14)]);
make("work-2.jpg", 1280, 960, 0.74, 0.38, [L(90, 2, 0.16), L(360, 2, 0.24), L(760, 2, 0.14), L(1040, 2, 0.26), L(1190, 2, 0.18)]);
make("work-3.jpg", 1280, 960, 0.50, 0.68, [L(180, 2, 0.22), L(560, 2, 0.14), L(880, 2, 0.28), L(1100, 2, 0.16)]);
make("work-4.jpg", 1280, 960, 0.86, 0.44, [L(60, 2, 0.18), L(300, 2, 0.26), L(700, 2, 0.14), L(980, 2, 0.22), L(1220, 2, 0.16)]);
make("studio.jpg", 1920, 1080, 0.44, 0.60, [L(160, 2, 0.24), L(520, 2, 0.14), L(900, 2, 0.20), L(1340, 2, 0.16), L(1700, 2, 0.22)]);
make("portal.jpg", 1280, 960, 0.50, 0.50, [L(200, 2, 0.20), L(640, 2, 0.26), L(1080, 2, 0.16)]);

// ── Portfolio project thumbnails (3:2, WebP q80) ──────────────────────
make("work-aeris.webp", 1200, 800, 0.72, 0.46, [L(140, 2, 0.22), L(480, 2, 0.14), L(820, 2, 0.20), L(1060, 2, 0.16)]);
make("work-lia.webp", 1200, 800, 0.38, 0.62, [L(180, 2, 0.18), L(560, 2, 0.24), L(900, 2, 0.14), L(1120, 2, 0.20)]);
make("work-arkhe.webp", 1200, 800, 0.50, 0.40, [L(120, 2, 0.16), L(420, 2, 0.22), L(760, 2, 0.14), L(1000, 2, 0.18), L(1160, 2, 0.14)]);
make("work-flowline.webp", 1200, 800, 0.84, 0.52, [L(90, 2, 0.20), L(360, 2, 0.14), L(700, 2, 0.22), L(1040, 2, 0.16), L(1180, 2, 0.18)]);
make("work-iz.webp", 1200, 800, 0.44, 0.68, [L(160, 2, 0.22), L(520, 2, 0.14), L(880, 2, 0.20), L(1100, 2, 0.16)]);
make("work-workoutclub.webp", 1200, 800, 0.60, 0.36, [L(100, 2, 0.18), L(400, 2, 0.24), L(760, 2, 0.14), L(1060, 2, 0.22), L(1180, 2, 0.16)]);