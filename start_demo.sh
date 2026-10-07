#!/usr/bin/env bash
# Desicio.ai Fullstack Launcher

echo "⚡ Starting Desicio.ai Fullstack MVP..."

# Start Backend
echo " Starting FastAPI backend on http://127.0.0.1:8000..."
cd backend
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start Frontend
echo " Starting Vite frontend on http://127.0.0.1:3000..."
cd frontend
npm run dev -- --host 127.0.0.1 --port 3000 &
FRONTEND_PID=$!
cd ..

echo "✅ Desicio.ai is running!"
echo "   - Frontend: http://127.0.0.1:3000"
echo "   - Backend:  http://127.0.0.1:8000"
echo "   - API Docs: http://127.0.0.1:8000/docs"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
