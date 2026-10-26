import subprocess

# Use Python's urllib instead
import urllib.request
import os

model_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/onnx/checkpoint.onnx"
config_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/config.json"
output_dir = r"D:\MyProjects\MyProjects\Matriotic\piper_model"

os.makedirs(output_dir, exist_ok=True)

print("Downloading checkpoint.onnx...")
urllib.request.urlretrieve(model_url, os.path.join(output_dir, "checkpoint.onnx"))
print("Downloading config.json...")
urllib.request.urlretrieve(config_url, os.path.join(output_dir, "config.json"))

print("Download complete!")
print(os.listdir(output_dir))