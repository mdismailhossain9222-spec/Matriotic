@echo off
REM ============================================================
REM Master Runner - Autonomous Outreach System
REM Runs in background, scrapes 200 valid leads, sends emails
REM Dashboard updates live at /admin/live-dashboard
REM ============================================================

cd /d "%~dp0"

echo.
echo ============================================================
echo   MASTER RUNNER - Autonomous Outreach System
echo   Target: 200 valid leads, all emailed
echo   Dashboard: http://localhost:3000/admin/live-dashboard
echo ============================================================
echo.

REM Check if .env exists
if not exist harvey\.env (
    echo ERROR: harvey\.env not found!
    echo Copy harvey\.env.example to harvey\.env and fill in your API keys
    pause
    exit /b 1
)

REM Check if Python venv exists
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate venv and install dependencies
echo Activating virtual environment and installing dependencies...
call .venv\Scripts\activate.bat
pip install -q -e ./harvey
if errorlevel 1 (
    echo ERROR: Failed to install Harvey dependencies
    pause
    exit /b 1
)

REM Install playwright browsers for LinkedIn scraping (optional)
python -m playwright install chromium 2>nul

echo.
echo Starting Master Runner in background...
echo Logs will appear below. Press Ctrl+C to stop.
echo.

REM Run the master runner
python master_runner.py

echo.
echo Master Runner stopped.
pause