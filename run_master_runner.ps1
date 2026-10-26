# ============================================================
# Master Runner - Autonomous Outreach System (PowerShell)
# Runs in background, scrapes 200 valid leads, sends emails
# Dashboard updates live at /admin/live-dashboard
# ============================================================

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "============================================================"
Write-Host "   MASTER RUNNER - Autonomous Outreach System"
Write-Host "   Target: 200 valid leads, all emailed"
Write-Host "   Dashboard: http://localhost:3000/admin/live-dashboard"
Write-Host "============================================================"
Write-Host ""

# Check if harvey\.env exists
if (-not (Test-Path "harvey\.env")) {
    Write-Error "ERROR: harvey\.env not found!"
    Write-Host "Copy harvey\.env.example to harvey\.env and fill in your API keys"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python venv exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Failed to create virtual environment"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Activate venv and install dependencies
Write-Host "Activating virtual environment and installing dependencies..."
& .\.venv\Scripts\Activate.ps1
pip install -q -e ./harvey
if ($LASTEXITCODE -ne 0) {
    Write-Error "ERROR: Failed to install Harvey dependencies"
    Read-Host "Press Enter to exit"
    exit 1
}

# Install playwright browsers for LinkedIn scraping (optional)
python -m playwright install chromium 2>$null

Write-Host ""
Write-Host "Starting Master Runner in background..."
Write-Host "Logs will appear below. Press Ctrl+C to stop."
Write-Host ""

# Run the master runner
python master_runner.py

Write-Host ""
Write-Host "Master Runner stopped."
Read-Host "Press Enter to exit"