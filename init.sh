#!/bin/bash

echo "========================================"
echo "    Media Editor - Inicialización"
echo "========================================"
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar errores
show_error() {
    echo -e "${RED}ERROR: $1${NC}"
    exit 1
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}ADVERTENCIA: $1${NC}"
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}$1${NC}"
}

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    show_error "Python 3 no está instalado. Por favor instala Python desde https://www.python.org/downloads/"
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    show_error "Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
fi

# Verificar si FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    show_warning "FFmpeg no está instalado o no está en el PATH"
    echo "Por favor instala FFmpeg desde https://ffmpeg.org/download.html"
    echo
    echo "Continuando con la instalación..."
    echo
fi

# Mostrar versiones
echo "Versiones detectadas:"
echo "Python: $(python3 --version)"
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo

# Configurar backend
echo "Configurando entorno virtual de Python..."
cd backend

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        show_error "No se pudo crear el entorno virtual"
    fi
else
    echo "Entorno virtual ya existe"
fi

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Actualizar pip
echo "Actualizando pip..."
python -m pip install --upgrade pip

# Instalar dependencias de Python
echo "Instalando dependencias de Python..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo
    echo -e "${YELLOW}ADVERTENCIA: Error instalando desde requirements.txt${NC}"
    echo "Intentando instalar dependencias individualmente..."
    pip install fastapi==0.104.1
    pip install uvicorn==0.24.0
    pip install python-multipart==0.0.6
    pip install aiofiles==23.2.1
    pip install python-ffmpeg==2.0.12
    if [ $? -ne 0 ]; then
        show_error "No se pudieron instalar las dependencias de Python. Verifica tu conexión a internet."
    fi
fi

show_success "Dependencias de Python instaladas correctamente"

# Configurar frontend
echo
echo "Configurando dependencias de Node.js..."
cd ../frontend

# Instalar dependencias de Node.js
echo "Instalando dependencias de Node.js..."
npm install
if [ $? -ne 0 ]; then
    show_error "No se pudieron instalar las dependencias de Node.js"
fi

show_success "Dependencias de Node.js instaladas correctamente"

echo
echo "========================================"
show_success "    ¡Inicialización completada!"
echo "========================================"
echo
echo "Para iniciar la aplicación:"
echo "  - Backend:  cd backend && source venv/bin/activate && python run.py"
echo "  - Frontend: cd frontend && npm start"
echo
echo "O ejecuta ./start.sh para iniciar ambos servicios"
echo
