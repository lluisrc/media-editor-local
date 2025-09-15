from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import os
import subprocess
import uuid
from pathlib import Path
import aiofiles

app = FastAPI(title="Media Editor API", version="1.0.0")

# Modelo para el procesamiento de vídeo
class VideoProcessRequest(BaseModel):
    file_id: str
    start_time: float = 0
    end_time: Optional[float] = None
    speed: float = 1.0
    format: str = "video+audio"  # video+audio, video-only, audio-only
    output_format: str = "mp4"  # mp4, mkv, mov, avi, webm, flv
    resolution: Optional[str] = None  # "1920x1080", "1280x720", "854x480", etc.
    rotation: int = 0  # 0, 90, 180, 270
    flip_horizontal: bool = False
    flip_vertical: bool = False
    crop: Optional[dict] = None  # {"x": 0, "y": 0, "width": 100, "height": 100}

# Configurar CORS para permitir requests desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorios para archivos
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

# Crear directorios si no existen
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Media Editor API"}

@app.get("/health")
async def health_check():
    """Verificar estado del servidor"""
    return {
        "status": "healthy",
        "message": "Servidor funcionando correctamente",
        "ffmpeg_available": check_ffmpeg()
    }

def check_ffmpeg():
    """Verificar si FFmpeg está disponible"""
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Subir un archivo de vídeo"""
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos de vídeo")
    
    # Generar nombre único para el archivo
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_extension}")
    
    # Guardar archivo
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return {"file_id": file_id, "filename": file.filename}

@app.post("/process")
async def process_video(request: VideoProcessRequest):
    """Procesar vídeo con las opciones especificadas"""
    
    # Extraer parámetros del request
    file_id = request.file_id
    start_time = request.start_time
    end_time = request.end_time
    speed = request.speed
    content_format = request.format
    output_format = request.output_format
    resolution = request.resolution
    rotation = request.rotation
    flip_horizontal = request.flip_horizontal
    flip_vertical = request.flip_vertical
    crop = request.crop
    
    # Buscar archivo original
    upload_path = None
    for file in os.listdir(UPLOAD_DIR):
        if file.startswith(file_id):
            upload_path = os.path.join(UPLOAD_DIR, file)
            break
    
    if not upload_path or not os.path.exists(upload_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Determinar extensión y configuración según formato de contenido
    if content_format == "audio-only":
        output_filename = f"processed_{file_id}.mp3"
        video_codec = None
        audio_codec = "libmp3lame"
    elif content_format == "video-only":
        output_filename = f"processed_{file_id}.{output_format}"
        video_codec = "libx264"
        audio_codec = None
    else:  # video+audio
        output_filename = f"processed_{file_id}.{output_format}"
        video_codec = "libx264"
        audio_codec = "aac"
    
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    # Construir comando FFmpeg
    cmd = ["ffmpeg", "-i", upload_path]
    
    # Construir filtros de vídeo
    video_filters = []
    
    # Aplicar velocidad
    if speed != 1.0 and video_codec:
        video_filters.append(f"setpts={1/speed}*PTS")
    
    # Aplicar recorte temporal (los tiempos se aplican al video original)
    if start_time > 0:
        cmd.extend(["-ss", str(start_time)])
    
    if end_time:
        # Calcular duración considerando la velocidad
        original_duration = end_time - start_time
        if speed != 1.0:
            # Para velocidad lenta (x0.5), necesitamos más tiempo de input
            # Para velocidad rápida (x2.0), necesitamos menos tiempo de input
            input_duration = original_duration / speed
            cmd.extend(["-t", str(input_duration)])
        else:
            cmd.extend(["-t", str(original_duration)])
    
    # Aplicar rotación
    if rotation != 0 and video_codec:
        if rotation == 90:
            video_filters.append("transpose=1")
        elif rotation == 180:
            video_filters.append("transpose=2,transpose=2")
        elif rotation == 270:
            video_filters.append("transpose=2")
    
    # Aplicar volteo horizontal
    if flip_horizontal and video_codec:
        video_filters.append("hflip")
    
    # Aplicar volteo vertical
    if flip_vertical and video_codec:
        video_filters.append("vflip")
    
    # Aplicar recorte (crop)
    if crop and video_codec:
        x = crop.get("x", 0)
        y = crop.get("y", 0)
        width = crop.get("width", 100)
        height = crop.get("height", 100)
        video_filters.append(f"crop={width}:{height}:{x}:{y}")
    
    # Aplicar cambio de resolución
    if resolution and video_codec:
        video_filters.append(f"scale={resolution}")
    
    # Aplicar filtros de vídeo si existen
    if video_filters and video_codec:
        cmd.extend(["-filter:v", ",".join(video_filters)])
    
    # Aplicar velocidad de audio
    if speed != 1.0 and audio_codec:
        cmd.extend(["-filter:a", f"atempo={speed}"])
    
    # Configurar códecs según formato
    if video_codec:
        cmd.extend(["-c:v", video_codec])
    else:
        cmd.extend(["-vn"])  # Sin vídeo
    
    if audio_codec:
        cmd.extend(["-c:a", audio_codec])
    else:
        cmd.extend(["-an"])  # Sin audio
    
    cmd.extend(["-y", output_path])
    
    try:
        # Ejecutar FFmpeg
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error procesando vídeo: {result.stderr}")
        
        return {"output_filename": output_filename, "file_id": file_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando vídeo: {str(e)}")

@app.get("/uploads/{filename}")
async def serve_uploaded_file(filename: str):
    """Servir archivo subido"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Determinar el tipo de media basado en la extensión
    if filename.lower().endswith('.mp4'):
        media_type = 'video/mp4'
    elif filename.lower().endswith('.avi'):
        media_type = 'video/x-msvideo'
    elif filename.lower().endswith('.mov'):
        media_type = 'video/quicktime'
    elif filename.lower().endswith('.mkv'):
        media_type = 'video/x-matroska'
    elif filename.lower().endswith('.webm'):
        media_type = 'video/webm'
    else:
        media_type = 'video/mp4'  # Por defecto
    
    response = FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type
    )
    
    # Añadir cabeceras CORS para permitir uso en canvas
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Descargar archivo procesado"""
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Determinar el tipo de media basado en la extensión
    if filename.lower().endswith('.mp4'):
        media_type = 'video/mp4'
    elif filename.lower().endswith('.avi'):
        media_type = 'video/x-msvideo'
    elif filename.lower().endswith('.mov'):
        media_type = 'video/quicktime'
    elif filename.lower().endswith('.mkv'):
        media_type = 'video/x-matroska'
    elif filename.lower().endswith('.webm'):
        media_type = 'video/webm'
    else:
        media_type = 'video/mp4'  # Por defecto
    
    response = FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type
    )
    
    # Añadir cabeceras CORS para permitir uso en canvas
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.get("/files")
async def list_files():
    """Listar archivos disponibles"""
    files = []
    
    # Archivos subidos
    for file in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, file)
        file_size = os.path.getsize(file_path)
        files.append({
            "type": "uploaded",
            "filename": file,
            "file_id": file.split('.')[0],
            "path": f"/uploads/{file}",
            "size": file_size,
            "size_mb": round(file_size / (1024 * 1024), 2)
        })
    
    # Archivos procesados
    for file in os.listdir(OUTPUT_DIR):
        file_path = os.path.join(OUTPUT_DIR, file)
        file_size = os.path.getsize(file_path)
        files.append({
            "type": "processed",
            "filename": file,
            "file_id": file.replace('processed_', '').split('.')[0],
            "path": f"/download/{file}",
            "size": file_size,
            "size_mb": round(file_size / (1024 * 1024), 2)
        })
    
    return {"files": files}

@app.delete("/files/{file_type}/{filename}")
async def delete_file(file_type: str, filename: str):
    """Eliminar archivo individual"""
    if file_type == "uploaded":
        file_path = os.path.join(UPLOAD_DIR, filename)
    elif file_type == "processed":
        file_path = os.path.join(OUTPUT_DIR, filename)
    else:
        raise HTTPException(status_code=400, detail="Tipo de archivo inválido")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    try:
        os.remove(file_path)
        return {"message": f"Archivo {filename} eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar archivo: {str(e)}")

@app.delete("/files/cleanup")
async def cleanup_files():
    """Limpiar todos los archivos"""
    deleted_count = 0
    errors = []
    
    # Limpiar archivos subidos
    try:
        for file in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, file)
            os.remove(file_path)
            deleted_count += 1
    except Exception as e:
        errors.append(f"Error limpiando uploads: {str(e)}")
    
    # Limpiar archivos procesados
    try:
        for file in os.listdir(OUTPUT_DIR):
            file_path = os.path.join(OUTPUT_DIR, file)
            os.remove(file_path)
            deleted_count += 1
    except Exception as e:
        errors.append(f"Error limpiando outputs: {str(e)}")
    
    return {
        "message": f"Limpieza completada. {deleted_count} archivos eliminados",
        "deleted_count": deleted_count,
        "errors": errors
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
