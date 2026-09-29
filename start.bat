@echo off
echo ========================================================
echo        Starting TrialLens Clinical Assistant
echo ========================================================
echo.
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "TrialLens Backend" cmd /k "cd /d "%~dp0sw1" && .venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload"
echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "TrialLens Frontend" cmd /k "cd /d "%~dp0" && npm run dev"
echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ========================================================
pause
