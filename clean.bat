@echo off
echo ========================================
echo    Media Editor - Limpieza
echo ========================================
echo.

echo Limpiando entorno virtual de Python...
if exist "backend\venv" (
    rmdir /s /q "backend\venv"
    echo Entorno virtual eliminado
) else (
    echo Entorno virtual no encontrado
)

echo.
echo Limpiando dependencias de Node.js...
if exist "frontend\node_modules" (
    rmdir /s /q "frontend\node_modules"
    echo Dependencias de Node.js eliminadas
) else (
    echo Dependencias de Node.js no encontradas
)

echo.
echo Limpiando archivos temporales...
if exist "backend\uploads" (
    del /q "backend\uploads\*" 2>nul
    echo Archivos de upload eliminados
)

if exist "backend\outputs" (
    del /q "backend\outputs\*" 2>nul
    echo Archivos de output eliminados
)

echo.
echo ========================================
echo    Limpieza completada
echo ========================================
echo.
echo Ahora puedes ejecutar init.bat para una instalacion limpia
echo.
pause
