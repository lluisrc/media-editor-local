#!/bin/bash

echo "========================================"
echo "    Media Editor - Verificación"
echo "========================================"
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar estado
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}OK: $2${NC}"
    else
        echo -e "${RED}ERROR: $2${NC}"
    fi
}

check_warning() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}OK: $2${NC}"
    else
        echo -e "${YELLOW}ADVERTENCIA: $2${NC}"
    fi
}

# Verificar Python
echo "Verificando Python..."
python3 --version >/dev/null 2>&1
check_status $? "Python instalado"

# Verificar Node.js
echo "Verificando Node.js..."
node --version >/dev/null 2>&1
check_status $? "Node.js instalado"

# Verificar FFmpeg
echo "Verificando FFmpeg..."
ffmpeg -version >/dev/null 2>&1
check_warning $? "FFmpeg instalado"

echo

# Verificar entorno virtual
echo "Verificando entorno virtual..."
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}OK: Entorno virtual existe${NC}"
else
    echo -e "${YELLOW}ADVERTENCIA: Entorno virtual no existe. Ejecuta ./init.sh${NC}"
fi

# Verificar dependencias de Python
echo "Verificando dependencias de Python..."
if [ -f "backend/venv/bin/activate" ]; then
    source backend/venv/bin/activate
    pip list | grep -q fastapi
    check_warning $? "Dependencias de Python instaladas"
else
    echo -e "${YELLOW}ADVERTENCIA: Entorno virtual no configurado. Ejecuta ./init.sh${NC}"
fi

# Verificar dependencias de Node.js
echo "Verificando dependencias de Node.js..."
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}OK: Dependencias de Node.js instaladas${NC}"
else
    echo -e "${YELLOW}ADVERTENCIA: Dependencias de Node.js no instaladas. Ejecuta ./init.sh${NC}"
fi

echo
echo "========================================"
echo "    Verificación completada"
echo "========================================"
echo
