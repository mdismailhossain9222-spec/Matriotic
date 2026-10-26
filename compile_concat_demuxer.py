import subprocess
import os
import glob

output_file = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"
frames_dir = r"D:\MyProjects\MyProjects\Matriotic\frames"

ffmpeg_path = r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# List frames and their durations
frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])
durations = [4, 6, 6, 6, 7]  # seconds

# Build individual short videos using loop filter and concat them
segments = []
concat_list = []

for i, (fname, dur) in enumerate(zip(frame_files, durations)):
    infile = os.path.join(frames_dir, fname)
    segment_out = f"D:\\MyProjects\\MyProjects\\Matriotic\\seg_{i:02d}.mp4"

    # Create segment at 1 frame per second * duration seconds
    # Using filter_complex: loop=1, duration=N, fps=1
    cmd = [
        ffmpeg_path,
        "-y",
        "-loop", "1",
        "-i", infile,
        "-filter_complex", f"loop=1:duration={dur},fps=1," + "\\".join([
            "format=pix_fmts=yuv420p",
            "format=rate=1"
        ]),
        "-t", str(dur),
        "-r", "1",  # 1 frame per second
        "-c:v", "rawvideo",
        "-pix_fmt", "rgb24",
        segment_out
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    size = os.path.getsize(segment_out) if os.path.exists(segment_out) else 0
    segments.append((i, segment_out, size))
    print(f"Segment {i}: {fname} dur={dur}s -> {size:,} bytes")

# Now use ffmpeg concat with audio copy
# But we need video segments first. Let's use the images directly with proper duration control

# Actually, simpler approach: create a single input list with image sequences
# Using concat demuxer with individual images having durations

# Build concat file with image durations
concat_input = os.path.join(frames_dir, "input.txt")
with open(concat_input, "w") as f:
    for i, fname in enumerate(frame_files):
        f.write(f"file '{os.path.join(frames_dir, fname)}'\n")
        f.write(f"duration {durations[i]}\n")

# Use concat demuxer with image2pipe or just images with duration
# The concat demuxer works with image sequences
cmd = [
    ffmpeg_path,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_input,
    "-r", "30",
    "-c:v", "libx264",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    output_file
]

result = subprocess.run(cmd, capture_output=True, text=True)
print(f"\n{result.stderr[-500:]}")
print(f"Exit code: {result.returncode}")

if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"\nFinal video: {size:,} bytes")

    # Probe duration
    probe = subprocess.run([
        ffmpeg_path, "-i", output_file,
        "-show_entries", "stream=duration,r_frame_rate",
        "-of", "json"
    ], capture_output=True, text=True)
    print(f"Probe: {probe.stdout}")
else:
    print("Video not generated")

# Cleanup temp files
for _, seg, _ in segments:
    if os.path.exists(seg):
        os.remove(seg)
if os.path.exists(concat_input):
    os.remove(concat_input)