import subprocess
import os

# Use PowerShell for downloads since curl has escaping issues
ps_script = """
$modelUrl = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/onnx/checkpoint.onnx"
$configUrl = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/lessac/en_US/lessac-medium/config.json"
$outputDir = "D:\\MyProjects\\MyProjects\\Matriotic\\piper_model"

# Create directory
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

# Download files
Invoke-WebRequest -Uri $modelUrl -OutFile "$outputDir\checkpoint.onnx" -UseBasicParsing
Invoke-WebRequest -Uri $configUrl -OutFile "$outputDir\config.json" -UseBasicParsing

Write-Output "Downloaded files to $outputDir"
Get-ChildItem "$outputDir"
"""

result = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("Error:", result.stderr)
