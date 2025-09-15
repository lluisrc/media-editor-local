# Guía de Instalación - Media Editor

## Requisitos Previos

### 1. Python 3.8 o superior
- Descarga desde: https://www.python.org/downloads/
- Asegúrate de marcar "Add Python to PATH" durante la instalación

### 2. Node.js 16 o superior
- Descarga desde: https://nodejs.org/
- Incluye npm automáticamente

### 3. FFmpeg
- **Windows**: Descarga desde https://ffmpeg.org/download.html
  - Extrae el archivo y añade la carpeta `bin` al PATH del sistema
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) o `sudo yum install ffmpeg` (CentOS/RHEL)

## Instalación

### Opción 1: Instalación Automática (Recomendada)

#### Windows:
```bash
# Ejecuta el archivo start.bat
start.bat
```

#### Linux/macOS:
```bash
# Ejecuta el script de inicio
./start.sh
```

### Opción 2: Instalación Manual

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

#### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Verificación de la Instalación

1. **Backend**: Abre http://localhost:8000 en tu navegador
   - Deberías ver: `{"message": "Media Editor API"}`

2. **Frontend**: Abre http://localhost:3000 en tu navegador
   - Deberías ver la interfaz de Media Editor

## Solución de Problemas

### Error: "FFmpeg no encontrado"
- Asegúrate de que FFmpeg esté instalado y en el PATH
- En Windows, reinicia la terminal después de añadir FFmpeg al PATH

### Error: "Puerto en uso"
- El puerto 8000 o 3000 ya está en uso
- Cierra otras aplicaciones que usen estos puertos
- O modifica los puertos en los archivos de configuración

### Error: "Módulo no encontrado"
- Asegúrate de activar el entorno virtual antes de instalar dependencias
- Ejecuta `pip install -r requirements.txt` nuevamente

## Uso

1. Abre http://localhost:3000
2. Arrastra un archivo de vídeo o haz clic para seleccionar
3. Ajusta los controles de edición:
   - **Tiempo de inicio/fin**: Para recortar el vídeo
   - **Velocidad**: Para acelerar o ralentizar
4. Haz clic en "Procesar Vídeo"
5. Descarga el resultado cuando esté listo

## Formatos Soportados

- **Entrada**: MP4, AVI, MOV, MKV, WMV, FLV, WebM
- **Salida**: MP4 (H.264 + AAC)

## Limitaciones

- Los archivos se procesan localmente
- El tamaño máximo recomendado es 1GB
- El procesamiento puede tardar según la duración y resolución del vídeo
