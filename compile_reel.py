import os
from moviepy import *

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

durations = [4, 6, 6, 6, 7] # Total 29 seconds

clips = []
for i, dur in enumerate(durations):
    img_path = os.path.join(frames_dir, f"frame_{i:04d}.png")
    clip = ImageClip(img_path).with_duration(dur)
    clips.append(clip)

final_clip = concatenate_videoclips(clips, method="compose")
final_clip.write_videofile(output_file, fps=30, codec="libx264", audio=False)
print(f"Successfully compiled reel to {output_file}")
