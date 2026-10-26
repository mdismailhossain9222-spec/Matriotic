import subprocess
import os

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Build concat input file
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])
durations = [4, 6, 6, 6, 7]

concat_file = os.path.join(frames_dir, "concat.txt")
with open(concat_file, "w") as f:
    for i, fname in enumerate(frame_files):
        # Use loop filter to set duration
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Create segments using filter_complex with trim
# Method: Use fps=30 to repeat frames for exact durations
cmd = [
    ffmpeg_path,
    "-y",
    "-framerate", "30",
    "-i", os.path.join(frames_dir, "frame_%04d.png"),
    "-vf", "fps=1/30,trim=duration=29",
    "-c:v", "libx264",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    output_file
]

print(f"Running ffmpeg with timed frame sequence...")
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stderr[-800:])
print(f"\nExit code: {result.returncode}")

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"Final video size: {size:,} bytes")
    print(f"Final path: {output_file}")
    # Check if it's 29+ seconds
    probe_cmd = [
        ffmpeg_path,
        "-i", output_file,
        "-show_entries", "stream=duration",
        "-of", "default"
    ]
    probe = subprocess.run(probe_cmd, capture_output=True, text=True)
    print(f"Duration probe: {probe.stdout.strip()}")
else:
    print("Video not generated")