import subprocess
import os
import re

# Download Piper TTS model for English (en_US)
model_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/onnx/checkpoint.onnx"
config_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/config.json"

model_dir = "D:\\MyProjects\\MyProjects\\Matriotic\\piper_model"
os.makedirs(model_dir, exist_ok=True)

# Download model
print("Downloading Piper TTS model...")
subprocess.run([
    "curl", "-sL", "-o", os.path.join(model_dir, "checkpoint.onnx"), model_url
], check=True)
subprocess.run([
    "curl", "-sL", "-o", os.path.join(model_dir, "config.json"), config_url
], check=True)
print("Model downloaded!")

# Download CC0 background music
music_url = "https://www.purple-planet.com/free-royalty-free-music/4576796-energetic-tech-beat"
print("Please download a CC0 background music track from:")
print("https://pixabay.com/music/")
print("or https://freemusicarchive.org/")
print("or https://www.bensound.com/")