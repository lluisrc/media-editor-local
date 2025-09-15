@echo off
echo ========================================
echo    Media Editor - Verificacion
echo ========================================
echo.

REM Verificar Python
echo Verificando Python...
python --version
if errorlevel 1 (
    echo ERROR: Python no encontrado
) else (
    echo OK: Python instalado
)
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js no encontrado
) else (
    echo OK: Node.js instalado
)
echo.

REM Verificar FFmpeg
echo Verificando FFmpeg...
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo ADVERTENCIA: FFmpeg no encontrado
) else (
    echo OK: FFmpeg instalado
)
echo.

REM Verificar entorno virtual
echo Verificando entorno virtual...
if exist "backend\venv" (
    echo OK: Entorno virtual existe
) else (
    echo ADVERTENCIA: Entorno virtual no existe. Ejecuta init.bat
)
echo.

REM Verificar dependencias de Python
echo Verificando dependencias de Python...
cd backend
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    pip list | findstr fastapi >nul
    if errorlevel 1 (
        echo ADVERTENCIA: Dependencias de Python no instaladas. Ejecuta init.bat
    ) else (
        echo OK: Dependencias de Python instaladas
    )
) else (
    echo ADVERTENCIA: Entorno virtual no configurado. Ejecuta init.bat
)
cd ..
echo.

REM Verificar dependencias de Node.js
echo Verificando dependencias de Node.js...
if exist "frontend\node_modules" (
    echo OK: Dependencias de Node.js instaladas
) else (
    echo ADVERTENCIA: Dependencias de Node.js no instaladas. Ejecuta init.bat
)
echo.

echo Probando conexion al backend...
python test_backend.py
echo.

echo ========================================
echo    Verificacion completada
echo ========================================
echo.
pause
