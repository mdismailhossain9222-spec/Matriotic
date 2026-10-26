import piper
print("Available:", dir(piper))

from piper import PiperVoice
import inspect

print("\nPiperVoice source file:", inspect.getfile(PiperVoice))

# Try to understand how to use it
help(PiperVoice.synthesize_wav)
