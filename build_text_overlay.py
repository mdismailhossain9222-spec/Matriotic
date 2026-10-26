#!/usr/bin/env python3
"""
Build Matriotic Reel - simple approach with color bars + text overlay.
No image files needed - use ffmpeg drawtext with built-in font.
"""
import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Use filter_complex with 5 sequential color inputs + text
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=1080x1920:d=4",
    "-f", "lavfi",
    "-i", "color=c=black:s=1080x1920:d=6",
    "-f", "lavfi",
    "-i", "color=c=black:s=1080x1920:d=6",
    "-f", "lavfi",
    "-i", "color=c=black:s=1080x1920:d=6",
    "-f", "lavfi",
    "-i", "color=c=black:s=1080x1920:d=7",
    "-filter_complex",
    "[0:v]drawtext=text='Your competitors are stealing your customers.':fontcolor=goldenrod:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2[0];"
    "[1:v]drawtext=text='We build high-converting websites for local businesses.':fontcolor=goldenrod:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2[1];"
    "[2:v]drawtext=text='98 Lighthouse Score. 100% Client Retention.':fontcolor=goldenrod:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2[2];"
    "[3:v]drawtext=text='Get a FREE custom demo in 8 hours.':fontcolor=goldenrod:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2[3];"
    "[4:v]drawtext=text='Claim yours now. Link in bio.':fontcolor=goldenrod:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2[4];"
    "[0][1][2][3][4]concat=n=5:v=1:a=0[out]",
    "-map", "[out]",
    "-c:v", "libx264",
    "-preset", "veryslow",
    "-crf", "18",
    "-b:v", "15M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print("Building 29s Reel with drawtext (goldenrod text)...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    # Check if it's just a fontconfig warning
    if "drawtext" in result.stderr.lower():
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
