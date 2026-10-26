from piper import PiperVoice
import os

# Initialize voice - need to load session first
config_path = r"D:\MyProjects\MyProjects\Matriotic\piper_model\config.json"
model_path = r"D:\MyProjects\MyProjects\Matriotic\piper_model\checkpoint.onnx"

# Create session
from piper import PiperSession

session = PiperSession(
    model_path=model_path,
    config_path=config_path,
    espeak_data_dir=r"D:\MyProjects\MyProjects\Matriotic\piper_model",
    download_dir=r"D:\MyProjects\MyProjects\Matriotic\piper_model"
)

# Use synthesizer
from piper import PiperSynthesizer

synth = PiperSynthesizer(session)

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
    audio = synth.synthesize(text)

    # Save as WAV
    import wave
    with wave.open(out_path, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(session.config.sample_rate)
        wf.writeframes(audio.tobytes())

    print(f"Generated {out_path} ({os.path.getsize(out_path):,} bytes)")

print("Voiceover synthesis complete!")