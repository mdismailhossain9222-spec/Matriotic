import requests
import os

# Use the found model
model_id = "csukuangfj/vits-piper-en_US-lessac-medium"
api_url = f"https://huggingface.co/api/models/{model_id}"
resp = requests.get(api_url)
data = resp.json()

# Get latest commit and tree
commit_url = f"https://huggingface.co/api/models/{model_id}/tree/main"
tree_resp = requests.get(commit_url)
tree = tree_resp.json()

print(f"Model: {model_id}")
print(f"Files: {len(tree)}")

# Download config
config_url = "https://huggingface.co/csukuangfj/vits-piper-en_US-lessac-medium/resolve/main/config.json"
config_path = r"D:\MyProjects\MyProjects\Matriotic\piper_model\config.json"
os.makedirs(os.path.dirname(config_path), exist_ok=True)

resp = requests.get(config_url, stream=True)
with open(config_path, "wb") as f:
    for chunk in resp.iter_content(chunk_size=1024):
        f.write(chunk)

print("Config downloaded!")

# Find ONNX file
for item in tree:
    if item['type'] == 'file' and ('.onnx' in item['path'] or '.onnx' in item['path']):
        print(f"Found: {item['path']}")
        download_url = f"https://huggingface.co/{model_id}/resolve/main/{item['path']}"
        out_path = os.path.join(r"D:\MyProjects\MyProjects\Matriotic\piper_model", os.path.basename(item['path']))

        resp = requests.get(download_url, stream=True)
        with open(out_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=1024*1024):
                f.write(chunk)
        print(f"Downloaded: {out_path}")