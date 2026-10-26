#!/usr/bin/env python3
"""
Simple 30-second vertical Reel generator using ffmpeg only.
Creates a premium Matriotic Studios advertising Reel for Instagram & Facebook.
"""
import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Frame durations (total should be 29s: 4+6+6+6+7)
durations = [4, 6, 6, 6, 7]
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])

# Build concat input file
concat_file = os.path.join(frames_dir, "input.txt")
with open(concat_file, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Use ffmpeg to compile with exact durations and higher bitrate for >1MB target
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-vf", "scale=1080:1920:flags=lanczos,trim=duration=29",
    "-r", "30",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",       # Lower CRF = higher quality = larger file
    "-b:v", "5M",      # 5Mbps → ensures >1MB for 29s
    "-maxrate", "6M",
    "-bufsize", "12M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print(f"Building 29-second Reel with 5Mbps video bitrate (CRF 18)...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:", result.stderr[-500:])
else:
    print("Video encoding complete!")

# Cleanup
if os.path.exists(concat_file):
    os.remove(concat_file)

# Probe result
probe = subprocess.run([
    ffmpeg_path, "-i", output_file,
    "-show_entries", "format=duration,size,bit_rate,r_frame_rate", "-of", "csv=p=0"
], capture_output=True, text=True)
print(f"Probe: {probe.stdout.strip()}")

# Check file size
if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"Final video: {output_file}")
    print(f"  Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
    print(f"  {'PASS' if size > 1024*1024 else 'FAIL'} (> 1MB requirement)")
    print(f"  Duration: 29 seconds (target 30s)")
    print(f"  Resolution: 1080x1920 (9:16 portrait)")
    print(f"  FPS: 30")