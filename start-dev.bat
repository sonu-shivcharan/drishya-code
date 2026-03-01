@echo off
REM Drishya-Code Development Startup Script for Windows

echo 🎨 Starting Drishya-Code Development Environment...
echo.

REM Check if node_modules exist
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo 🚀 Starting services...
echo.

REM Start backend
echo Starting backend server on http://localhost:3001...
start "Drishya-Code Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend on http://localhost:5173...
start "Drishya-Code Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Development environment is running!
echo.
echo 📊 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo.
echo Close the terminal windows to stop the services
echo.

pause
