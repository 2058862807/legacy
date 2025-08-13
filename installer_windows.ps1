# Dream installer for Windows
param()

Write-Host "Setting up Dream..."

# Ensure script runs from project root
Set-Location -Path $PSScriptRoot

# Create venv
py -3.11 -m venv .venv
if (!(Test-Path ".\.venv\Scripts\python.exe")) {
  Write-Error "Python 3.11 not found. Install from python.org and retry."
  exit 1
}

# Upgrade pip and install deps
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# Create a simple Windows shortcut to start Dream
$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut("$env:USERPROFILE\Desktop\Dream.lnk")
$shortcut.TargetPath = ".\.venv\Scripts\python.exe"
$shortcut.Arguments = "backend\app.py"
$shortcut.WorkingDirectory = (Get-Location).Path
$shortcut.IconLocation = (Get-Location).Path + "\frontend\favicon.ico,0"

