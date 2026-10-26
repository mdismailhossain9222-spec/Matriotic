import subprocess
import os

# Use python -m to run piper
result = subprocess.run(
    ["python", "-m", "piper_tts", "--help"],
    capture_output=True, text=True
)
print(result.stdout[:500] if result.returncode == 0 else result.stderr[:500])
