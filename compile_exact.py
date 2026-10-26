import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"

# Each frame stays on screen for its specified duration
# Total: 4 + 6 + 6 + 6 + 7 = 29 seconds
frame_durations = [4, 6, 6, 6, 7]
frame_paths = [
    r"D:\MyProjects\MyProjects\Matriotic\frames\frame_0000.png",
    r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4",
    r"D:\MyProjects\MyProjects\Matriotic\frames\frame_0002.png",
    r"D:\MyProjects\MyProjects\Matriotic\frames\frame_0003.png",
    r"D:\MyProjects\MyProjects\Matriotic\frames\frame_0004.png"
]

# Build timestamps for each frame
# Frame 0: 0.0 - 4.0s
# Frame 1: 4.0 - 10.0s
# Frame 2: 10.0 - 16.0s
# Frame 3: 16.0 - 22.0s
# Frame 4: 22.0 - 29.0s

cmd = [
    r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe",
    "-y",
    "-loop", "1", "-i", frame_paths[0],
    "-loop", "1", "-i", frame_paths[1],
    "-loop", "1", "-i", frame_paths[2],
    "-loop", "1", "-i", frame_paths[3],
    "-loop", "1", "-i", frame_paths[4],
    "-filter_complex",
    "[0:v]setpts=PTS+0/VSYNC[v0];"
    "[1:v]setpts=PTS+4*VSYNC[v1];"
    "[2:v]setpts=PTS+10*VSYNC[v2];"
    "[3:v]setpts=PTS+16*VSYNC[v3];"
    "[4:v]setpts=PTS+22*VSYNC[v4];"
    "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[out]",
    "-map", "[out]",
    "-r", "30",
    output_file
]

print(f"Running ffmpeg with precise timing...")
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stderr[-500:])
print(f"Exit code: {result.returncode}")

if os.path.exists(output_file):
    print(f"Final video size: {os.path.getsize(output_file):,} bytes")
