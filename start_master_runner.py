#!/usr/bin/env python3
"""
Background launcher for master_runner.py
Runs the master runner detached from the terminal.
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    project_root = Path(__file__).parent.absolute()

    # Check if harvey/.env exists
    harvey_env = project_root / "harvey" / ".env"
    if not harvey_env.exists():
        print("ERROR: harvey/.env not found!")
        print("Copy harvey/.env.example to harvey/.env and fill in your API keys")
        sys.exit(1)

    # Check if venv exists
    venv_path = project_root / ".venv"
    if not venv_path.exists():
        print("Creating Python virtual environment...")
        result = subprocess.run([sys.executable, "-m", "venv", str(venv_path)])
        if result.returncode != 0:
            print("ERROR: Failed to create virtual environment")
            sys.exit(1)

    # Determine python executable
    if sys.platform == "win32":
        python_exe = venv_path / "Scripts" / "python.exe"
        activate_script = venv_path / "Scripts" / "activate.bat"
    else:
        python_exe = venv_path / "bin" / "python"
        activate_script = venv_path / "bin" / "activate"

    # Install dependencies
    print("Installing Harvey dependencies...")
    result = subprocess.run([str(python_exe), "-m", "pip", "install", "-q", "-e", "./harvey"], cwd=project_root)
    if result.returncode != 0:
        print("ERROR: Failed to install Harvey dependencies")
        sys.exit(1)

    # Install playwright browsers (optional)
    print("Installing Playwright browsers...")
    subprocess.run([str(python_exe), "-m", "playwright", "install", "chromium"],
                   cwd=project_root, capture_output=True)

    print("\nStarting Master Runner in background...")
    print("Dashboard: http://localhost:3000/admin/live-dashboard")
    print("Logs will be written to master_runner.log")
    print("Press Ctrl+C to stop.\n")

    # Run master_runner.py with output to log file
    log_file = project_root / "master_runner.log"

    with open(log_file, "a") as log:
        log.write(f"\n=== Master Runner started at {__import__('datetime').datetime.now()} ===\n")

        # Run detached on Windows, or with nohup on Unix
        if sys.platform == "win32":
            # On Windows, use START /B to run in background
            cmd = [
                "cmd", "/c", "start", "/B", "",
                str(python_exe), "master_runner.py"
            ]
            proc = subprocess.Popen(cmd, cwd=project_root,
                                   stdout=log, stderr=subprocess.STDOUT,
                                   creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)
        else:
            # On Unix, use nohup
            cmd = ["nohup", str(python_exe), "master_runner.py"]
            proc = subprocess.Popen(cmd, cwd=project_root,
                                   stdout=log, stderr=subprocess.STDOUT,
                                   start_new_session=True)

        print(f"Master Runner started with PID: {proc.pid}")
        print(f"Log file: {log_file}")
        print("\nTo stop it later, run: python stop_master_runner.py")
        print("Or find the process and kill it manually.")

    # Save PID for later stopping
    pid_file = project_root / "master_runner.pid"
    pid_file.write_text(str(proc.pid))

    print("\nMaster Runner is now running in the background!")
    print("You can close this terminal.")

if __name__ == "__main__":
    main()