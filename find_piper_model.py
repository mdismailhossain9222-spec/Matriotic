import requests

# Search for en_US lessac medium model
url = "https://huggingface.co/api/models?search=en_US+lessac+medium&limit=5"
resp = requests.get(url)
models = resp.json()

print("Available models:")
for m in models[:10]:
    print(f"  - {m['id']}")