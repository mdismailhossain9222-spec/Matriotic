import subprocess
import os
import glob

# Clean up old files
for f in glob.glob(r"D:\MyProjects\MyProjects\Matriotic\*.mp4"):
    if "Premium" in os.path.basename(f) or f.endswith("_final.mp4"):
        try:
            os.remove(f)
            print(f"Removed: {f}")
        except:
            pass

# Build final high-quality compilation
output = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Create concat input with proper image durations
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])
durations = [4, 6, 6, 6, 7]

concat_file = os.path.join(frames_dir, "input.txt")
with open(concat_file, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Compile with higher quality
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-vf", "scale=1080:1920:flags=lanczos",
    "-r", "30",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-b:v", "2500k",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output
]

print(f"Building 30-second reel: 4s + 6s + 6s + 6s + 7s = {sum(durations)}s")
print(f"FPS: 30, Resolution: 1080x1920")

result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print("Error:", result.stderr[-500:])
else:
    print("Encoding complete!")

# Cleanup
if os.path.exists(concat_file):
    os.remove(concat_file)

# Final info
if os.path.exists(output):
    size = os.path.getsize(output)
    duration = subprocess.run([
        ffmpeg_path, "-i", output,
        "-show_entries", "format=duration", "-of", "csv=p=0"
    ], capture_output=True, text=True).stdout.strip()
    print(f"\nFinal: {output}")
    print(f"  Duration: {duration}s")
    print(f"  Size: {size:,} bytes ({size/1024:.1f} KB)")
    print(f"\nTo view: open in any video player or drag to Instagram/Facebook")