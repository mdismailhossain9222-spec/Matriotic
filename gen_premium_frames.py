import os
from PIL import Image, ImageDraw, ImageFont

width, height = 1080, 1920
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"
os.makedirs(frames_dir, exist_ok=True)

# Matriotic brand colors
DARK_BG = (10, 10, 12)
GOLD = (204, 202, 82)
WHITE = (255, 255, 255)
MID_GRAY = (40, 40, 45)

# Frame content: text + background elements
frames_content = [
    {
        "text": "Your competitors are stealing your customers.",
        "duration": 4,
        "bg_elements": [
            # Glowing orbit rings
            ("ellipse", 100, 300, 200, 500, GOLD, 0.1),
            ("ellipse", 800, 300, 900, 500, GOLD, 0.1),
            # Sparkle particles
            ("circle", 300, 800, 310, 810, GOLD),
            ("circle", 700, 900, 710, 910, GOLD),
            ("circle", 500, 1200, 510, 1210, GOLD),
        ]
    },
    {
        "text": "We build high-converting websites for local businesses.",
        "duration": 6,
        "bg_elements": [
            # Device mockups
            {"type": "rect", "x": 100, "y": 400, "w": 400, "h": 250, "color": MID_GRAY, "radius": 10},
            {"type": "rect", "x": 550, "y": 400, "w": 400, "h": 250, "color": MID_GRAY, "radius": 10},
            # Screen content
            {"type": "rect", "x": 130, "y": 430, "w": 340, "h": 200, "color": (20, 20, 25)},
            {"type": "rect", "x": 580, "y": 430, "w": 340, "h": 200, "color": (20, 20, 25)},
        ]
    },
    {
        "text": "98 Lighthouse Score. 100% Client Retention.",
        "duration": 6,
        "bg_elements": [
            # Metric cards
            {"type": "round_rect", "x": 150, "y": 400, "w": 350, "h": 200, "color": MID_GRAY, "radius": 12},
            {"type": "round_rect", "x": 580, "y": 400, "w": 350, "h": 200, "color": MID_GRAY, "radius": 12},
            # Stats
            {"type": "text", "text": "98", "x": 250, "y": 460, "color": GOLD, "size": 80},
            {"type": "text", "text": "LIGHTHOUSE", "x": 230, "y": 550, "color": WHITE, "size": 20},
            {"type": "text", "text": "100%", "x": 680, "y": 460, "color": GOLD, "size": 80},
            {"type": "text", "text": "CLIENT", "x": 660, "y": 550, "color": WHITE, "size": 20},
            {"type": "text", "text": "RETENTION", "x": 640, "y": 570, "color": WHITE, "size": 20},
        ]
    },
    {
        "text": "Get a FREE custom demo in 8 hours.",
        "duration": 6,
        "bg_elements": [
            # CT icon
            {"type": "circle", "x": 540, "y": 850, "r": 120, "color": GOLD},
            # Stars around icon
            {"type": "circle", "x": 420, "y": 750, "r": 15, "color": GOLD},
            {"type": "circle", "x": 660, "y": 750, "r": 15, "color": GOLD},
            {"type": "circle", "x": 540, "y": 720, "r": 15, "color": GOLD},
            {"type": "circle", "x": 420, "y": 850, "r": 15, "color": GOLD},
            {"type": "circle", "x": 660, "y": 850, "r": 15, "color": GOLD},
            {"type": "circle", "x": 540, "y": 980, "r": 15, "color": GOLD},
        ]
    },
    {
        "text": "Claim yours now. Link in bio.",
        "duration": 7,
        "bg_elements": [
            # CTA button
            {"type": "round_rect", "x": 350, "y": 750, "w": 380, "h": 100, "color": GOLD, "radius": 50},
            # Arrow
            {"type": "poly", "points": [(540, 860), (620, 820), (620, 880)], "color": (10, 10, 12)},
        ]
    },
]

def draw_element(draw, el):
    # Normalize element to tuple format
    if isinstance(el, dict):
        el_type = el.get("type")
        if el_type == "ellipse":
            el = ("ellipse", el["x"], el["y"], el["w"], el["h"], el["color"], el.get("opacity", 0.3))
        elif el_type == "circle":
            r = el.get("r", 20)
            el = ("circle", el["x"] - r, el["y"] - r, el["x"] + r, el["y"] + r, el["color"])
        elif el_type == "text":
            el = ("text", el["text"], el["x"], el["y"], el["color"], el.get("size", 30))
        elif el_type in ("rect", "round_rect"):
            el = (el_type, el["x"], el["y"], el["w"], el["h"], el["color"], el.get("radius", 12))

    el_type = el[0] if isinstance(el, tuple) else "rect"

    if el_type == "ellipse":
        x1, y1, x2, y2 = el[1], el[2], el[1] + el[3], el[2] + el[4]
        color = el[5] if len(el) > 5 else GOLD
        draw.ellipse([x1, y1, x2, y2], fill=color)
    elif el_type == "circle":
        cx, cy, r = (el[1] + el[3]) // 2, (el[2] + el[4]) // 2, (el[3] - el[1]) // 2
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=el[4] if len(el) > 4 else GOLD)
    elif el_type == "text":
        text, x, y, color, size = el[1], el[2], el[3], el[4], el[5] if len(el) > 5 else GOLD
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
        except:
            font = ImageFont.load_default()
        draw.text((x, y), text, font=font, fill=color)
    elif el_type in ("rect", "round_rect"):
        x1 = el[1] if isinstance(el[1], int) else el.get("x", 0)
        y1 = el[2] if isinstance(el[2], int) else el.get("y", 0)
        w = el[3] if isinstance(el[3], int) else el.get("w", 0)
        h = el[4] if isinstance(el[4], int) else el.get("h", 0)
        x2, y2 = x1 + w, y1 + h
        color = el[5] if len(el) > 5 else GOLD
        radius = el[6] if len(el) > 6 else 12
        draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=color)

def create_frame(frame_num, content):
    img = Image.new('RGB', (width, height), DARK_BG)
    draw = ImageDraw.Draw(img)

    # Background elements
    for el in content["bg_elements"]:
        draw_element(draw, el)

    # Text
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 70)
    except:
        font = ImageFont.load_default()

    text = content["text"]
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = height // 2 - text_height // 2

    # Shadow
    draw.text((x + 2, y + 2), text, font=font, fill=(50, 50, 50))
    # Main text with glow effect
    draw.text((x, y), text, font=font, fill=GOLD)

    frame_path = os.path.join(frames_dir, f'frame_{frame_num:04d}.png')
    img.save(frame_path)
    return frame_path

# Generate all frames
for i, content in enumerate(frames_content):
    frame_path = create_frame(i, content)
    print(f"Created frame_{i:04d}.png ({os.path.getsize(frame_path):,} bytes)")

print("All frames generated!")
