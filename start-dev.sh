#!/bin/bash

# Drishya-Code Development Startup Script

echo "🎨 Starting Drishya-Code Development Environment..."
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🚀 Starting services..."
echo ""

# Start backend in background
echo "Starting backend server on http://localhost:3001..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:5173..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment is running!"
echo ""
echo "📊 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
