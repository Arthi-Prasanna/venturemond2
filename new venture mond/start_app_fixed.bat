@echo off
set "PYTHON_EXE=C:\Users\jarth\AppData\Local\Programs\Python\Python312\python.exe"

echo Stopping any previous instances...
taskkill /F /IM python.exe /T >nul 2>&1

echo.
echo Installing dependencies (just in case)...
"%PYTHON_EXE%" -m pip install fastapi uvicorn

echo.
echo Starting Flowmondo Server...
echo ---------------------------------------------------
echo Go to your browser and open: http://localhost:8000
echo ---------------------------------------------------
echo.

"%PYTHON_EXE%" backend/main.py
pause
