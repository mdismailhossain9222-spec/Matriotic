import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

# ffmpeg command to compile images to video at 30fps
cmd = [
    r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe",
    "-y",
    "-framerate", "30",
    "-i", os.path.join(frames_dir, "frame_%04d.png"),
    "-vf", "scale=1080:-2:flags=lanczos",
    "-c:v", "libx264",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    output_file
]

print(f"Running: {' '.join(cmd)}")
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout[-1000:] if len(result.stdout) > 1000 else result.stdout)
print(result.stderr[-1000:] if len(result.stderr) > 1000 else result.stderr)
print(f"Exit code: {result.returncode}")

# Check file
if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"File size: {size:,} bytes")
    if size > 10000:
        print("Video generated successfully!")
    else:
        print("Video file too small - check stderr output above")
else:
    print("File not created")
