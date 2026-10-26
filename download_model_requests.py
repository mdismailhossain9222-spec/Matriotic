import subprocess

# Try a different approach - use requests library
import requests
import os

model_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/onnx/checkpoint.onnx"
config_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/config.json"
output_dir = r"D:\MyProjects\MyProjects\Matriotic\piper_model"

os.makedirs(output_dir, exist_ok=True)

print("Downloading model...")
response = requests.get(model_url, stream=True)
response.raise_for_status()
with open(os.path.join(output_dir, "checkpoint.onnx"), "wb") as f:
    for chunk in response.iter_content(chunk_size=1024*1024):
        f.write(chunk)
print("Done!")