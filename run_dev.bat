@echo off
echo === djsite-matthew: Installing and starting dev server (npm) ===
where npm >nul 2>&1
if errorlevel 1 (
  echo npm not found. Please install Node.js (https://nodejs.org) and try again.
  pause
  exit /b 1
)
npm install
npm run dev
