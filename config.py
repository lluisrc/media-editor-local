"""
Configuración global para Media Editor
"""
import os
from pathlib import Path

# Directorio base del proyecto
BASE_DIR = Path(__file__).parent

# Configuración del backend
BACKEND_CONFIG = {
    "host": "0.0.0.0",
    "port": 8000,
    "reload": True,
    "log_level": "info"
}

# Configuración del frontend
FRONTEND_CONFIG = {
    "port": 3000,
    "host": "localhost"
}

# Directorios de archivos
UPLOAD_DIR = BASE_DIR / "backend" / "uploads"
OUTPUT_DIR = BASE_DIR / "backend" / "outputs"

# Crear directorios si no existen
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Configuración de FFmpeg
FFMPEG_CONFIG = {
    "max_file_size": 1024 * 1024 * 1024,  # 1GB
    "supported_formats": [".mp4", ".avi", ".mov", ".mkv", ".wmv", ".flv", ".webm"],
    "output_format": "mp4",
    "video_codec": "libx264",
    "audio_codec": "aac"
}

# Configuración de CORS
CORS_CONFIG = {
    "allow_origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"]
}
