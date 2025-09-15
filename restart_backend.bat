@echo off
echo ========================================
echo    Media Editor - Reiniciar Backend
echo ========================================
echo.

REM Verificar si el entorno virtual existe
if not exist "backend\venv" (
    echo ERROR: Entorno virtual no encontrado
    echo Por favor ejecuta init.bat primero
    pause
    exit /b 1
)

echo Deteniendo procesos de Python existentes...
taskkill /f /im python.exe 2>nul

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo Iniciando backend con entorno virtual...
cd backend
call venv\Scripts\activate.bat
python run.py

pause
