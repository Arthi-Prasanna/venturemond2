@echo off
echo Starting Flowmondo (Standalone Mode)...
echo This will run the Python backend which now also serves the Frontend.
echo.

REM Start Backend
start "Flowmondo App" cmd /k "py backend/main.py"

echo Wrapper started.
echo Please wait for the window to say "Uvicorn running on http://0.0.0.0:8000"
echo Then open your browser at: http://localhost:8000
echo.
pause
