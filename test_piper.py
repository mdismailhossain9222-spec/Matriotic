import subprocess
import os

# Test Piper TTS installation
result = subprocess.run(["pipper-tts", "--help"], capture_output=True, text=True)
print("Piper TTS:", result.stdout[:200] if result.returncode == 0 else result.stderr[:200])
