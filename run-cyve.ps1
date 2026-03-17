# CYVE Development Startup Script
# This script starts both the PHP backend and the Next.js frontend

Write-Host "🚀 Starting CYVE Application..." -ForegroundColor Cyan

# 1. Start PHP Backend in a new window
# We start it from the root directory so base URL http://127.0.0.1:8000/backend/api/ works
Write-Host "Starting PHP Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "php -S 127.0.0.1:8000 -t ."

# 2. Start Next.js Frontend in a new window
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Both servers are starting in separate windows." -ForegroundColor Green
Write-Host "Wait a few seconds, then visit http://localhost:3000" -ForegroundColor Green
