#!/bin/bash

echo "Iniciando Media Editor..."
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para mostrar errores
show_error() {
    echo -e "${RED}ERROR: $1${NC}"
    exit 1
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}ADVERTENCIA: $1${NC}"
}

# Verificar si el entorno virtual existe
if [ ! -d "backend/venv" ]; then
    show_error "Entorno virtual no encontrado. Por favor ejecuta ./init.sh primero"
fi

# Verificar si las dependencias de Node.js están instaladas
if [ ! -d "frontend/node_modules" ]; then
    show_error "Dependencias de Node.js no encontradas. Por favor ejecuta ./init.sh primero"
fi

# Verificar dependencias del sistema
if ! command_exists python3; then
    show_error "Python 3 no está instalado"
fi

if ! command_exists node; then
    show_error "Node.js no está instalado"
fi

if ! command_exists ffmpeg; then
    show_warning "FFmpeg no está instalado o no está en el PATH"
    echo "Instala FFmpeg desde: https://ffmpeg.org/download.html"
    echo "Continuando sin FFmpeg (algunas funciones pueden no funcionar)..."
fi

echo "Iniciando backend (FastAPI) con entorno virtual..."
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!

echo "Esperando 5 segundos para que el backend se inicie..."
sleep 5

echo "Iniciando frontend (React)..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo -e "${GREEN}Aplicación iniciada!${NC}"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo
echo "Presiona Ctrl+C para detener ambos servicios"

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servicios detenidos${NC}"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Esperar a que termine cualquiera de los procesos
wait
