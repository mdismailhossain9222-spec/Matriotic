#!/usr/bin/env python3
"""
Stop the background master runner.
"""

import os
import sys
import signal
from pathlib import Path

def main():
    project_root = Path(__file__).parent.absolute()
    pid_file = project_root / "master_runner.pid"

    if not pid_file.exists():
        print("No master_runner.pid file found. Is it running?")
        # Try to find by process name
        if sys.platform == "win32":
            os.system('taskkill /f /im python.exe /fi "WINDOWTITLE eq master_runner*" 2>nul')
        else:
            os.system("pkill -f 'master_runner.py'")
        print("Attempted to kill any master_runner.py processes.")
        return

    pid = int(pid_file.read_text().strip())

    print(f"Stopping Master Runner (PID: {pid})...")

    try:
        if sys.platform == "win32":
            # On Windows, use taskkill
            os.system(f'taskkill /f /pid {pid}')
        else:
            # On Unix, send SIGTERM
            os.kill(pid, signal.SIGTERM)

        print("Stop signal sent.")
        pid_file.unlink()

    except ProcessLookupError:
        print(f"Process {pid} not found (already stopped?).")
        pid_file.unlink()
    except Exception as e:
        print(f"Error stopping process: {e}")

if __name__ == "__main__":
    main()