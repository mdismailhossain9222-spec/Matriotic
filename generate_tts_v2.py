from piper import PiperVoice
import wave
import os

# Initialize - it should auto-detect model from directory
voice = PiperVoice()

print("Voice loaded successfully!")
print(f"Sample rate: {voice.sample_rate}")

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

    size = os.path.getsize(out_path)
    print(f"Generated voice_{i:02d}.wav ({size:,} bytes)")

print("\nVoiceover synthesis complete!")