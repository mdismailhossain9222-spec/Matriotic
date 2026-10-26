import os
from moviepy import *
from PIL import Image, ImageDraw, ImageFont

print("Moviepy imported successfully v2.x")

width, height = 1080, 1920
fps = 30

# Create simple solid background color clip
bg = ColorClip(size=(width, height), color=(10, 10, 12)).with_duration(30)

# Create text clips using TextClip (v2 API)
def make_txt(msg, duration, start):
    txt = TextClip(font="arial.ttf", text=msg, font_size=60, color="white", size=(900, None), method="caption")
    return txt.with_duration(duration).with_start(start).with_position("center")

c1 = make_txt("Your competitors are stealing your customers.", 4.5, 0)
c2 = make_txt("We build high-converting websites for local businesses.", 6.0, 4.5)
c3 = make_txt("98 Lighthouse Score. 100% Client Retention.", 6.0, 10.5)
c4 = make_txt("Get a 100% FREE custom demo in 8 hours.", 6.0, 16.5)
c5 = make_txt("Claim yours now. Link in bio.", 7.5, 22.5)

final = CompositeVideoClip([bg, c1, c2, c3, c4, c5], size=(width, height))
output_file = "D:\\MyProjects\\MyProjects\\Matriotic\\Matriotic_Reel_Premium.mp4"
final.write_videofile(output_file, fps=fps, codec="libx264", audio=False)
print(f"Successfully generated: {output_file}")
