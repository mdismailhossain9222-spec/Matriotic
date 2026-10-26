# Hyperframes Composition Brief: Matriotic Studios

## Objective
Create a high-end cinematic agency showcase (Reel) for Matriotic Studios LLC.

## Output
- Composition directory: `D:/MyProjects/MyProjects/Matriotic/brag-output-2026-10-20-100000/composition/`
- Rendered video: `D:/MyProjects/MyProjects/Matriotic/brag-output-2026-10-20-100000/brag.mp4`
- Format: vertical — 1080x1920
- Duration: ~40 seconds (extended for cinematic showcase)

## Source Material
- Project root: D:/MyProjects/MyProjects/Matriotic
- Website: https://matriotic.vercel.app/
- Product name: Matriotic Studios
- Tagline: "Digital Experiences, Engineered to Convert."
- Key UI to recreate: Mobile viewport (390x844) of the website
- Copy that must appear verbatim:
  - "Matriotic Studios"
  - "Digital Experiences, Engineered to Convert."
  - "Boutique Web Development"
  - "Unreasonable attention to detail. 98 Lighthouse Score."
  - "Get a 100% FREE Demo in 8 Hours."

## Creative Direction
- Tone preset: cinematic
- Creative direction: High-end agency showcase with premium motion graphics
- Interpretation: Dramatic, trailer-scale energy with smooth transitions and precise typography
- Angle: Boutique agency that delivers exceptional performance and attention to detail
- Hook: Glowing gradient orb with "Matriotic Studios" text
- Outro / punchline: "Get a 100% FREE Demo in 8 Hours."

## Visual Identity
- Background: Dark with gradient effects
- Text: Inter/Poppins font (sleek, modern)
- Accent: Glowing orb effects (purple/blue gradient)
- Display font: Inter/Poppins
- Body font: Inter/Poppins
- Visual references: Website screenshots, project portfolio items

## Storyboard
Use the storyboard in `D:/MyProjects/MyProjects/Matriotic/brag-output-2026-10-20-100000/brag-plan.md` as the creative contract.

Scene summary:
1. Premium Intro (3s) — Glowing orb, text animation
2. Website Tour (10s) — Mobile viewport scroll with zoom
3. Portfolio Showcase (10s) — 3 project transitions with cursor animation
4. Design Analysis (10s) — Bounding box, color pills, typography analysis
5. CTA & Outro (5s) — Darkening BG, pulsing button, fade to black

## Audio
- Audio role: cinematic support with rhythmic accents
- Audio arc: Builds from deep bass to energetic middle, then fades to silence
- Music: Cinematic, bass-heavy CC0 track
- Music treatment: Strong entrance, ambient middle section, final swell before fade
- Music cue guidance: Detect at composition via beat analysis
- Audio-reactive treatment: expressive - glow intensity responds to bass frequencies
- Audio-coupled moments:
  - Intro - bass pulse sync with orb glow
  - Website tour - smooth ambient pad
  - Portfolio showcase - rhythmic hits for transitions
  - Design analysis - UI click sounds for interactions
  - CTA - final resonance swell
- SFX selection guidance: Subtle UI sounds, glitch effects for transitions, smooth ambient tones
- SFX analysis guidance: Use low-frequency sounds for polished moments
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation
- Audio files: Copy the chosen music and any Hyperframes-selected SFX into `D:/MyProjects/MyProjects/Matriotic/brag-output-2026-10-20-100000/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, and `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (website screenshots)
- Keep all text readable in the final render
- Keep the video within 15-25 seconds (extended to 40s for this cinematic showcase)
- Include the planned music/SFX layer unless audio was explicitly disabled
- Treat audio notes as guidance, not a fixed cue sheet
- Use SFX to support motion and interaction
- Honor planned music treatment
- Consider audio-reactive workflow for glow effects
- Use local assets for audio and any required runtime/media dependencies
- Run `hyperframes check` before render
- Keep creation and rendering local