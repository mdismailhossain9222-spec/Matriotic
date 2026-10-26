import subprocess
import os
from piper import PiperVoice

# Initialize voice
voice = PiperVoice(speed=0.9)

# Generate voiceover
texts = [
    "Your competitors are stealing your customers.",
    "We build high-converting websites for local businesses.",
    "Engineered for pure performance: 98 Lighthouse Score.",
    "100% Client Retention.",
    "Get a FREE custom demo in 8 hours. Link in bio."
]

output_dir = r"D:\MyProjects\MyProjects\Matriotic\audio"
os.makedirs(output_dir, exist_ok=True)

for i, text in enumerate(texts):
    out_path = os.path.join(output_dir, f"voice_{i:02d}.wav")
    voice.synthesize(text, out_path)
    print(f"Generated {out_path} ({os.path.getsize(out_path):,} bytes)")

print("Voiceover synthesis complete!")