# Media Editor - Editor y Convertidor de Vídeos Local

Una aplicación web local completa para edición y conversión de vídeos con React y FastAPI.

## Características

### 🎬 **Edición de Vídeo Avanzada**
- **Carga de archivos** de vídeo con drag & drop
- **Controles de vídeo en tiempo real** con play/pause
- **Barra de progreso interactiva** para navegación
- **Marcadores arrastrables** para selección de inicio y fin
- **Selección visual** del área de recorte
- **Ajuste de velocidad** de reproducción (0.25x - 4x)
- **Pausa automática** al llegar al final del recorte
- **Navegación rápida** con botones de inicio y fin
- **Reproducción inteligente** dentro del rango seleccionado
- **Captura de frames** como imágenes JPG
- **Velocidad en tiempo real** aplicada al preview
- **Preview visual** de rotación y volteo en tiempo real

### 🔄 **Conversión de Formatos**
- **MP4** (H.264) - Compatible universalmente
- **MKV** (H.264) - Alta calidad, contenedor flexible
- **MOV** (H.264) - Formato Apple, alta calidad
- **AVI** (H.264) - Formato clásico de Windows
- **WebM** (VP9) - Optimizado para web
- **FLV** (H.264) - Formato Flash, streaming

### 📐 **Transformaciones de Vídeo**
- **🖥️ Resoluciones horizontales** (16:9) - Full HD, HD, SD, 360p, 240p
- **📱 Resoluciones verticales** (9:16) - Full HD Vertical, HD Vertical, SD Vertical
- **⬜ Resoluciones cuadradas** (1:1) - Instagram Square, HD Square, SD Square
- **📺 Redes sociales** - Instagram Story, TikTok, YouTube Shorts, YouTube
- **Resolución personalizada** (cualquier ancho x alto)
- **Rotación** (0°, 90°, 180°, 270°)
- **Volteo horizontal y vertical**
- **Escalado inteligente** manteniendo proporciones

### 📁 **Opciones de Descarga**
- **Vídeo + Audio** (todos los formatos)
- **Solo Vídeo** (todos los formatos)
- **Solo Audio** (MP3 con LAME)

### 🎨 **Interfaz Moderna**
- **Diseño responsivo** y atractivo
- **Controles intuitivos** con feedback visual
- **Información en tiempo real** de la selección
- **Animaciones suaves** y transiciones
- **Tema moderno** con gradientes y sombras

### ⚡ **Procesamiento Local**
- **FFmpeg integrado** para procesamiento
- **Sin colas de procesamiento** - edición inmediata
- **Múltiples formatos** de entrada y salida
- **Procesamiento en servidor local**

## Instalación

### Opción 1: Inicialización Automática (Recomendada)

#### Windows:
```bash
# Ejecuta el script de inicialización
init.bat
```

#### Linux/macOS:
```bash
# Ejecuta el script de inicialización
./init.sh
```

### Opción 2: Instalación Manual

#### Backend (FastAPI)
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

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Requisitos

- Python 3.8+
- Node.js 16+
- FFmpeg instalado en el sistema

## Scripts Disponibles

- `init.bat` / `init.sh` - Inicialización automática del proyecto
- `start.bat` / `start.sh` - Iniciar la aplicación
- `check.bat` / `check.sh` - Verificar instalación y dependencias
- `clean.bat` / `clean.sh` - Limpiar entorno y archivos temporales

## Uso

### 1. Inicialización (solo la primera vez)
```bash
# Windows
init.bat

# Linux/macOS
./init.sh
```

### 2. Iniciar la aplicación
```bash
# Windows
start.bat

# Linux/macOS
./start.sh
```

**Nota:** Los scripts de inicio ahora activan automáticamente el entorno virtual de Python y verifican que todas las dependencias estén instaladas.

### 3. Usar la aplicación
1. Abre http://localhost:3000 en tu navegador
2. Carga un vídeo y aplica las ediciones deseadas
3. Descarga el resultado procesado

## Solución de Problemas

### Error de dependencias de Python
Si encuentras errores al instalar dependencias:
```bash
# Limpiar entorno
clean.bat    # Windows
./clean.sh   # Linux/macOS

# Reinstalar
init.bat     # Windows
./init.sh    # Linux/macOS
```

### Verificar instalación
```bash
# Verificar estado
check.bat    # Windows
./check.sh   # Linux/macOS
```
