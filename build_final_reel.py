#!/usr/bin/env python3
"""
Build Matriotic Reel using ffmpeg with concat demuxer.
Simple approach: use 5 image frames, each held for its duration.
"""
import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Frame durations: 4+6+6+6+7 = 29s total
durations = [4, 6, 6, 6, 7]
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])

# Build concat input file with durations
concat_file = os.path.join(frames_dir, "concat_list.txt")
with open(concat_file, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Use ffmpeg to concatenate images with exact durations
# -crf 18 gives high quality, -b:v 5M ensures >1MB output
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-vf", "scale=1080:1920:flags=lanczos",
    "-r", "30",
    "-c:v", "libx264",
    "-crf", "18",
    "-b:v", "5M",
    "-maxrate", "6M",
    "-bufsize", "12M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print("Building 29s Matriotic Reel (1080x1920, 30fps)...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:", result.stderr[-500:])
else:
    print("Encoding complete!")

# Cleanup
if os.path.exists(concat_file):
    os.remove(concat_file)

# Verify output
if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFile: {output_file}")
    print(f"Size: {size:,} bytes ({size/1024:.1f} KB)")
    print(f"Status: {'PASS' if size > 1024*1024 else 'FAIL'} (>1MB)")

    # Probe duration and resolution
    probe = subprocess.run([
        ffmpeg_path, "-i", output_file,
        "-show_entries", "stream=width,height,r_frame_rate,codec_name,duration",
        "-of", "csv=p=0"
    ], capture_output=True, text=True)
    print(f"Stream: {probe.stdout.strip()}")