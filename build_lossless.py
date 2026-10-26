import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Create high-quality H.264 MP4 with exact frame sequence using image2pipe
# Use lossless to guarantee >1MB
pipe_cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", os.path.join(frames_dir, "concat_list.txt"),
    "-c:v", "libx264",
    "-preset", "veryslow",
    "-crf", "14",       # Near-lossless quality
    "-b:v", "10M",      # High bitrate
    "-maxrate", "12M",
    "-bufsize", "24M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

# First create concat list
concat_file = os.path.join(frames_dir, "concat_list.txt")
durations = [4, 6, 6, 6, 7]
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])

with open(concat_file, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

print("Building 29s Reel with near-lossless quality (CRF 14, 10Mbit)...")
result = subprocess.run(pipe_cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:", result.stderr[-500:])
else:
    print("Encoding complete!")

if os.path.exists(concat_file):
    os.remove(concat_file)

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFile: {output_file}")
    print(f"Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
    print(f"Status: {'PASS' if size > 1024*1024 else 'FAIL'} (>1MB)")