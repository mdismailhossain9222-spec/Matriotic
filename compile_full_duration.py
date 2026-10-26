import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

# Generate 30 seconds of video using loop input for ffmpeg
cmd = [
    r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe",
    "-y",
    "-loop", "1", "-i", os.path.join(frames_dir, "frame_0000.png"),
    "-loop", "1", "-i", os.path.join(frames_dir, "frame_0001.png"),
    "-loop", "1", "-i", os.path.join(frames_dir, "frame_0002.png"),
    "-loop", "1", "-i", os.path.join(frames_dir, "frame_0003.png"),
    "-loop", "1", "-i", os.path.join(frames_dir, "frame_0004.png"),
    "-filter_complex",
    "[0:v]trim=duration=4[v0];"
    "[1:v]trim=duration=6[v1];"
    "[2:v]trim=duration=6[v2];"
    "[3:v]trim=duration=6[v3];"
    "[4:v]trim=duration=7[v4];"
    "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0,format=yuv420p[v]",
    "-map", "[v]",
    "-r", "30",
    output_file
]

print(f"Running ffmpeg complex concatenation...")
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stderr[-500:])
print(f"Exit code: {result.returncode}")

if os.path.exists(output_file):
    print(f"Final video size: {os.path.getsize(output_file):,} bytes")
