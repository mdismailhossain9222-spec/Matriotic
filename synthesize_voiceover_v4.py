from piper import PiperVoice
import wave
import os

# Load voice
voice = PiperVoice.load(
    model_path=r"D:\MyProjects\MyProjects\Matriotic\piper_model\en_US-lessac-medium.onnx",
    config_path=r"D:\MyProjects\MyProjects\Matriotic\piper_model\config.json",
    espeak_data_dir=r"D:\MyProjects\MyProjects\Matriotic\piper_model",
    download_dir=r"D:\MyProjects\MyProjects\Matriotic\piper_model"
)

print("Voice loaded!")

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
    with wave.open(out_path, 'wb') as wf:
        voice.synthesize_wav(text, wf)
    print(f"voice_{i:02d}.wav: {os.path.getsize(out_path):,} bytes")

print("Done!")