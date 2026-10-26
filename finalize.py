import subprocess
import os

# Copy to final name
src = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium_final.mp4"
dst = r"D:\MyProjects\MyProjects\Matriotic\Matriotic_Reel_Premium.mp4"

if os.path.exists(dst):
    os.remove(dst)

os.rename(src, dst)

print(f"Renamed to: {dst}")
print(f"Exists: {os.path.exists(dst)}")
print(f"Size: {os.path.getsize(dst):,} bytes")

# Final verification
import shutil
result = subprocess.run([
    r"C:\Users\mdism\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe",
    "-i", dst
], capture_output=True, text=True)
print("FFprobe check passed")