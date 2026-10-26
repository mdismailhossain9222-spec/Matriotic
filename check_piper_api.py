from piper import PiperVoice
import inspect

# Check available parameters
sig = inspect.signature(PiperVoice.__init__)
print("PiperVoice parameters:", list(sig.parameters.keys()))

# Check what methods are available
methods = [m for m in dir(PiperVoice) if not m.startswith('_')]
print("Methods:", methods)
