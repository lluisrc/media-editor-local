#!/bin/bash

echo "========================================"
echo "    Media Editor - Limpieza"
echo "========================================"
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar estado
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}OK: $2${NC}"
    else
        echo -e "${YELLOW}INFO: $2${NC}"
    fi
}

echo "Limpiando entorno virtual de Python..."
if [ -d "backend/venv" ]; then
    rm -rf "backend/venv"
    show_status 0 "Entorno virtual eliminado"
else
    show_status 1 "Entorno virtual no encontrado"
fi

echo
echo "Limpiando dependencias de Node.js..."
if [ -d "frontend/node_modules" ]; then
    rm -rf "frontend/node_modules"
    show_status 0 "Dependencias de Node.js eliminadas"
else
    show_status 1 "Dependencias de Node.js no encontradas"
fi

echo
echo "Limpiando archivos temporales..."
if [ -d "backend/uploads" ]; then
    rm -f "backend/uploads"/*
    show_status 0 "Archivos de upload eliminados"
else
    show_status 1 "Directorio de uploads no encontrado"
fi

if [ -d "backend/outputs" ]; then
    rm -f "backend/outputs"/*
    show_status 0 "Archivos de output eliminados"
else
    show_status 1 "Directorio de outputs no encontrado"
fi

echo
echo "========================================"
echo -e "${GREEN}    Limpieza completada${NC}"
echo "========================================"
echo
echo "Ahora puedes ejecutar ./init.sh para una instalación limpia"
echo
