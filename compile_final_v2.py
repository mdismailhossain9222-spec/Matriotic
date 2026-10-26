import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium_final.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Create concat file with image durations
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])
durations = [4, 6, 6, 6, 7]

concat_input = os.path.join(frames_dir, "input.txt")
with open(concat_input, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Use ffmpeg concat with x264, slower but better quality
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_input,
    "-vf", "scale=1080:-2:flags=lanczos",
    "-r", "30",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print(f"Running optimized compilation...")
result = subprocess.run(cmd, capture_output=True, text=True)
print(f"Exit code: {result.returncode}")

# Probe result
probe = subprocess.run([
    ffmpeg_path, "-i", output_file,
    "-show_entries", "stream=duration,r_frame_rate",
    "-of", "json"
], capture_output=True, text=True)
print(f"Info: {probe.stdout.strip()}")

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFinal video: {size:,} bytes ({size/1024:.1f} KB)")
    print(f"Path: {output_file}")
else:
    print("Video not generated")

# Cleanup
if os.path.exists(concat_input):
    os.remove(concat_input)