#!/usr/bin/env python3
"""Generate clean frames with text for the Matriotic Reel."""
import os
from PIL import Image, ImageDraw, ImageFont

width, height = 1080, 1920
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"
os.makedirs(frames_dir, exist_ok=True)

DARK_BG = (10, 10, 12)
GOLD = (204, 202, 82)

texts = [
    "Your competitors are stealing your customers.",
    "We build high-converting websites for local businesses.",
    "98 Lighthouse Score. 100% Client Retention.",
    "Get a FREE custom demo in 8 hours.",
    "Claim yours now. Link in bio."
]

for i, text in enumerate(texts):
    img = Image.new('RGB', (width, height), DARK_BG)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 70)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = height // 2 - text_height // 2

    # Shadow
    draw.text((x + 2, y + 2), text, font=font, fill=(50, 50, 50))
    # Main text
    draw.text((x, y), text, font=font, fill=GOLD)

    frame_path = os.path.join(frames_dir, f'frame_{i:04d}.png')
    img.save(frame_path)
    print(f"Created frame_{i:04d}.png ({os.path.getsize(frame_path):,} bytes)")

print(f"Done! {len(texts)} frames generated.")
