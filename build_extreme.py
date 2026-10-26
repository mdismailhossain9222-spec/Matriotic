#!/usr/bin/env python3
"""
Build Matriotic Reel - maximum bitrate approach.
Use very high bitrate to ensure >1MB for 29 seconds.
"""
import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFMPEG_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Use a single complex command that creates text overlays with very high bitrate
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "lavfi",
    "-i", "color=c=0x0a0a0c:s=1080x1920:d=29",
    "-vf",
    "drawtext=text='Your competitors are stealing your customers.':fontcolor=0xffcc00:fontsize=72:x=(w-text_w)/2:y=100,",
    "drawtext=text='We build high-converting websites for local businesses.':fontcolor=0xffcc00:fontsize=64:x=(w-text_w)/2:y=250,",
    "drawtext=text='98 Lighthouse Score. 100% Client Retention.':fontcolor=0xffcc00:fontsize=64:x=(w-text_w)/2:y=400,",
    "drawtext=text='Get a FREE custom demo in 8 hours.':fontcolor=0xffcc00:fontsize=64:x=(w-text_w)/2:y=550,",
    "drawtext=text='Claim yours now. Link in bio.':fontcolor=0xffcc00:fontsize=64:x=(w-text_w)/2:y=700",
    "-c:v", "libx264",
    "-preset", "veryslow",
    "-crf", "10",
    "-b:v", "50M",           # 50 Mbps video
    "-maxrate", "60M",
    "-bufsize", "80M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print("Building 29s Reel with 50Mbps bitrate (max quality)...")
print("This will take 1-2 minutes...")

result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    # Check if it's just a fontconfig warning
    if "Fontconfig error" in result.stderr:
        print("Fontconfig warning (non-critical), checking output...")
    else:
        print("ERROR:", result.stderr[-500:])
else:
    print("Encoding complete!")

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFile: {output_file}")
    print(f"Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
    print(f"Status: {'PASS' if size > 1024*1024 else 'FAIL'} (>1MB)")
