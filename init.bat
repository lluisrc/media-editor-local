@echo off
echo ========================================
echo    Media Editor - Inicializacion
echo ========================================
echo.

REM Verificar si Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Verificar si Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si FFmpeg esta instalado
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo ADVERTENCIA: FFmpeg no esta instalado o no esta en el PATH
    echo Por favor instala FFmpeg desde https://ffmpeg.org/download.html
    echo.
    echo Continuando con la instalacion...
    echo.
)

echo Configurando entorno virtual de Python...
cd backend

REM Crear entorno virtual si no existe
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: No se pudo crear el entorno virtual
        pause
        exit /b 1
    )
) else (
    echo Entorno virtual ya existe
)

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate.bat

REM Actualizar pip
echo Actualizando pip...
python -m pip install --upgrade pip

REM Instalar dependencias de Python
echo Instalando dependencias de Python...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias de Python
    echo.
    echo Intentando instalar dependencias individualmente...
)

echo.
echo Configurando dependencias de Node.js...
cd ..\frontend

REM Instalar dependencias de Node.js
echo Instalando dependencias de Node.js...
npm install
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias de Node.js
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Inicializacion completada!
echo ========================================
echo.
echo Para iniciar la aplicacion:
echo   - Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo   - Frontend: cd frontend ^&^& npm start
echo.
echo O ejecuta start.bat para iniciar ambos servicios
echo.
pause
