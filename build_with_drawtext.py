import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Generate synthetic 30s test video with multiple frame segments
# Each segment is a solid color block with text
ffmpeg_cmd = [
    ffmpeg_path,
    "-y",
    "-f", "lavfi",
    "-i", "color=c=0x0A0A0C:s=1080x1920:d=4,drawtext=text='Your competitors are stealing your customers.':fontcolor=0xCCCA52:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2",
    "-f", "lavfi",
    "-i", "color=c=0x0A0A0C:s=1080x1920:d=6,drawtext=text='We build high-converting websites for local businesses.':fontcolor=0xCCCA52:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2",
    "-f", "lavfi",
    "-i", "color=c=0x0A0A0C:s=1080x1920:d=6,drawtext=text='98 Lighthouse Score. 100% Client Retention.':fontcolor=0xCCCA52:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2",
    "-f", "lavfi",
    "-i", "color=c=0x0A0A0C:s=1080x1920:d=6,drawtext=text='Get a FREE custom demo in 8 hours.':fontcolor=0xCCCA52:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2",
    "-f", "lavfi",
    "-i", "color=c=0x0A0A0C:s=1080x1920:d=7,drawtext=text='Claim yours now. Link in bio.':fontcolor=0xCCCA52:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2",
    "-filter_complex",
    "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0,format=yuv420p[out]",
    "-map", "[out]",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "16",
    "-b:v", "8M",
    "-maxrate", "10M",
    "-bufsize", "20M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output_file
]

print("Building 29s Reel with drawtext (no external font needed)...")
result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:", result.stderr[-500:])
else:
    print("Encoding complete!")

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFile: {output_file}")
    print(f"Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
    print(f"Status: {'PASS' if size > 1024*1024 else 'FAIL'} (>1MB)")