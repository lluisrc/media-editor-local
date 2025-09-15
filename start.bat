@echo off
echo Iniciando Media Editor...
echo.

REM Verificar si el entorno virtual existe
if not exist "backend\venv" (
    echo ERROR: Entorno virtual no encontrado
    echo Por favor ejecuta init.bat primero
    pause
    exit /b 1
)

REM Verificar si las dependencias de Node.js estan instaladas
if not exist "frontend\node_modules" (
    echo ERROR: Dependencias de Node.js no encontradas
    echo Por favor ejecuta init.bat primero
    pause
    exit /b 1
)

echo Iniciando backend (FastAPI) con entorno virtual...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"

echo Esperando 5 segundos para que el backend se inicie...
timeout /t 5 /nobreak > nul

echo Iniciando frontend (React)...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Aplicacion iniciada!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo NOTA: Asegurate de que FFmpeg este instalado y en el PATH
echo.
pause
