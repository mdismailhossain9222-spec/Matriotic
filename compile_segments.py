import subprocess
import os
import glob

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

# Get all frame files
frame_files = sorted(glob.glob(os.path.join(frames_dir, "frame_*.png")))
print(f"Found {len(frame_files)} frames")

# Method: Create individual video segments at different durations and concatenate
segments = []
durations = [4, 6, 6, 6, 7]  # seconds
frame_durations = [4*30, 6*30, 6*30, 6*30, 7*30]  # frames

ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# Create each segment
for i, (frame_file, dur) in enumerate(zip(frame_files, frame_durations)):
    out = f"D:\\MyProjects\\MyProjects\\Matriotic\\segment_{i:02d}.mp4"
    cmd = [
        ffmpeg_path,
        "-y",
        "-loop", "1",
        "-i", frame_file,
        "-t", str(dur),
        "-r", "30",
        "-c:v", "libx264",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        out
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    segments.append(out)
    print(f"Created segment {i}: {os.path.getsize(out):,} bytes")

# Concatenate all segments with copy codec (fast, no re-encoding)
concat_file = "D:\\MyProjects\\MyProjects\\Matriotic\\segments.txt"
with open(concat_file, "w") as f:
    for seg in segments:
        f.write(f"file '{seg}'\n")

concat_cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-c", "copy",
    output_file
]

result = subprocess.run(concat_cmd, capture_output=True, text=True)
print(result.stderr[-300:])
print(f"\nFinal video: {os.path.exists(output_file)}")
if os.path.exists(output_file):
    print(f"File size: {os.path.getsize(output_file):,} bytes")
    print(f"Final path: {output_file}")

# Cleanup
for seg in segments:
    if os.path.exists(seg):
        os.remove(seg)
if os.path.exists(concat_file):
    os.remove(concat_file)

print("Done!")
