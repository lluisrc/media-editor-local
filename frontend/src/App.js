import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('video+audio');
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [resolution, setResolution] = useState('');
  const [customResolution, setCustomResolution] = useState({ width: '', height: '' });
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const canvasRef = useRef(null);

  // Efectos para control de vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Pausar vídeo cuando llegue al punto de corte final
      if (endTime && video.currentTime >= endTime) {
        video.pause();
        setIsPlaying(false);
      }
      
      // Pausar vídeo si está antes del punto de inicio (si hay selección)
      if (startTime > 0 && video.currentTime < startTime) {
        video.pause();
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setEndTime(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, endTime]);

  // Efectos para arrastre de marcadores
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingStart) {
        handleStartTimeDrag(e);
      } else if (isDraggingEnd) {
        handleEndTimeDrag(e);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
    };

    if (isDraggingStart || isDraggingEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, videoDuration, startTime, endTime]);

  // Efecto para aplicar velocidad de reproducción en tiempo real
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Aplicar velocidad de reproducción
    video.playbackRate = speed;
  }, [speed]);

  // Efecto para aplicar transformaciones visuales en tiempo real
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Aplicar transformaciones CSS
    let transform = '';
    
    // Rotación
    if (rotation !== 0) {
      transform += `rotate(${rotation}deg) `;
    }
    
    // Volteo horizontal
    if (flipHorizontal) {
      transform += 'scaleX(-1) ';
    }
    
    // Volteo vertical
    if (flipVertical) {
      transform += 'scaleY(-1) ';
    }
    
    video.style.transform = transform.trim();
  }, [rotation, flipHorizontal, flipVertical]);


  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setProcessedFile(null);
      
      // Crear URL para preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Resetear controles
      setStartTime(0);
      setEndTime(null);
      setSpeed(1.0);
      
      // Subir archivo al servidor
      uploadFile(file);
    } else {
      setError('Por favor selecciona un archivo de vídeo válido');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFileId(response.data.file_id);
      setSuccess(`Archivo subido correctamente: ${response.data.filename}`);
    } catch (error) {
      setError('Error al subir el archivo: ' + (error.response?.data?.detail || error.message));
    }
  };

  const processVideo = async () => {
    if (!fileId) {
      setError('No hay archivo cargado');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const processData = {
        file_id: fileId,
        start_time: startTime,
        end_time: endTime,
        speed: speed,
        format: downloadFormat,
        output_format: outputFormat,
        resolution: resolution || null,
        rotation: rotation,
        flip_horizontal: flipHorizontal,
        flip_vertical: flipVertical
      };

      const response = await axios.post(`${API_BASE_URL}/process`, processData);

      setProcessedFile(response.data.output_filename);
      setSuccess('Vídeo procesado correctamente');
    } catch (error) {
      setError('Error al procesar el vídeo: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (processedFile) {
      const downloadUrl = `${API_BASE_URL}/download/${processedFile}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = processedFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Funciones de control de vídeo
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        // Si hay una selección y el vídeo está fuera del rango, ir al inicio
        if (startTime > 0 && video.currentTime < startTime) {
          video.currentTime = startTime;
        }
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const seekTo = (time) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  };

  const goToStartOfSelection = () => {
    seekTo(startTime);
  };

  const goToEndOfSelection = () => {
    seekTo(endTime || videoDuration);
  };


  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    setIsCapturing(true);
    
    try {
      // Configurar el canvas con las dimensiones del vídeo
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dibujar el frame actual del vídeo en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `captura_${formatTime(currentTime).replace(':', '-')}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          setSuccess(`Captura guardada: ${formatTime(currentTime)}`);
        }
      }, 'image/jpeg', 0.9);
      
    } catch (error) {
      setError('Error al capturar el frame: ' + error.message);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * videoDuration;
    
    seekTo(newTime);
  };

  const handleStartTimeDrag = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * videoDuration;
    
    if (newTime < (endTime || videoDuration)) {
      setStartTime(newTime);
    }
  };

  const handleEndTimeDrag = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * videoDuration;
    
    if (newTime > startTime) {
      setEndTime(newTime);
    }
  };

  const getVideoDuration = () => {
    if (videoRef.current) {
      return videoRef.current.duration;
    }
    return 0;
  };

  const handleVideoLoaded = () => {
    const duration = getVideoDuration();
    setEndTime(duration);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎬 Media Editor</h1>
        <p>Edita tus vídeos de forma sencilla y rápida</p>
      </div>

      <div className="main-content">
        {/* Sección de carga */}
        <div 
          className={`upload-section ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            Arrastra tu vídeo aquí o haz clic para seleccionar
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="file-input"
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar Vídeo
          </button>
        </div>

        {/* Información del archivo */}
        {selectedFile && (
          <div className="file-info">
            <h3>📄 Archivo seleccionado</h3>
            <p><strong>Nombre:</strong> {selectedFile.name}</p>
            <p><strong>Tamaño:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p><strong>Tipo:</strong> {selectedFile.type}</p>
          </div>
        )}

        {/* Preview del vídeo con controles avanzados */}
        {videoUrl && (
          <div className="video-preview">
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoUrl}
                onLoadedMetadata={handleVideoLoaded}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
                className="main-video"
              />
              
              
              {/* Controles personalizados */}
              <div className="video-controls">
                <button 
                  className="play-pause-btn"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <button 
                  className="seek-btn start-seek-btn"
                  onClick={goToStartOfSelection}
                  title="Ir al inicio del recorte"
                >
                  ⏮️
                </button>
                
                <button 
                  className="seek-btn end-seek-btn"
                  onClick={goToEndOfSelection}
                  title="Ir al final del recorte"
                >
                  ⏭️
                </button>
                
                <button 
                  className="capture-btn"
                  onClick={captureFrame}
                  disabled={isCapturing}
                  title="Capturar frame actual como JPG"
                >
                  {isCapturing ? '📸' : '📷'}
                </button>
                
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                  {speed !== 1.0 && (
                    <span className="speed-indicator">
                      ⚡ {speed}x
                    </span>
                  )}
                  {(startTime > 0 || (endTime && endTime < videoDuration)) && (
                    <span className="selection-mode-indicator">
                      📹 Modo Selección
                    </span>
                  )}
                </div>
                
                <div className="progress-container">
                  <div 
                    ref={progressBarRef}
                    className="progress-bar"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="progress-fill"
                      style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                    />
                    
                    {/* Marcador de inicio */}
                    <div 
                      className="start-marker"
                      style={{ left: `${(startTime / videoDuration) * 100}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingStart(true);
                      }}
                    />
                    
                    {/* Marcador de fin */}
                    <div 
                      className="end-marker"
                      style={{ left: `${((endTime || videoDuration) / videoDuration) * 100}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingEnd(true);
                      }}
                    />
                    
                    {/* Área de selección */}
                    <div 
                      className="selection-area"
                      style={{
                        left: `${(startTime / videoDuration) * 100}%`,
                        width: `${(((endTime || videoDuration) - startTime) / videoDuration) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles de edición */}
        {fileId && (
          <div className="controls-section">
            <h2>🎛️ Controles de Edición</h2>
            
            {/* Información de selección */}
            <div className="selection-info">
              <span className="selection-time">
                {formatTime(startTime)} - {formatTime(endTime || videoDuration)}
              </span>
              <span className="selection-duration">
                {formatTime((endTime || videoDuration) - startTime)}
              </span>
            </div>

            {/* Recorte de tiempo y velocidad */}
            <div className="time-speed-row">
              <div className="time-controls">
                <label>Recorte</label>
                <div className="time-inputs">
                  <input
                    type="number"
                    min="0"
                    max={videoDuration}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                    className="time-input"
                    placeholder="Inicio (s)"
                  />
                  <span className="time-separator">-</span>
                  <input
                    type="number"
                    min="0"
                    max={videoDuration}
                    step="0.1"
                    value={endTime || ''}
                    onChange={(e) => setEndTime(parseFloat(e.target.value) || null)}
                    className="time-input"
                    placeholder="Fin (s)"
                  />
                </div>
              </div>
              
              <div className="speed-controls">
                <label>Velocidad</label>
                <div className="speed-options">
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="0.25"
                      checked={speed === 0.25}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>0.25x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="0.5"
                      checked={speed === 0.5}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>0.5x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="0.75"
                      checked={speed === 0.75}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>0.75x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="1"
                      checked={speed === 1}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>1x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="1.25"
                      checked={speed === 1.25}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>1.25x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="1.5"
                      checked={speed === 1.5}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>1.5x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="2"
                      checked={speed === 2}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>2x</span>
                  </label>
                  <label className="speed-option">
                    <input
                      type="radio"
                      name="speed"
                      value="4"
                      checked={speed === 4}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <span>4x</span>
                  </label>
                </div>
              </div>
            </div>


            {/* Formato, Resolución y Descarga */}
            <div className="format-resolution-row">
              {/* Formato de descarga */}
              <div className="control-group">
                <label>Descarga</label>
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="format-select"
                >
                  <option value="video+audio">Vídeo + Audio</option>
                  <option value="video-only">Solo Vídeo</option>
                  <option value="audio-only">Solo Audio</option>
                </select>
              </div>

              {/* Formato de salida */}
              {downloadFormat !== 'audio-only' && (
                <div className="control-group">
                  <label>Formato</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="format-select"
                  >
                    <option value="mp4">MP4</option>
                    <option value="mkv">MKV</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                    <option value="webm">WebM</option>
                    <option value="flv">FLV</option>
                  </select>
                </div>
              )}

              {/* Resolución */}
              {downloadFormat !== 'audio-only' && (
                <div className="control-group">
                  <label>Resolución</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="resolution-select"
                  >
                    <option value="">Original</option>
                    
                    {/* Resoluciones horizontales */}
                    <optgroup label="🖥️ Horizontales (16:9)">
                      <option value="1920x1080">1920x1080 (Full HD)</option>
                      <option value="1280x720">1280x720 (HD)</option>
                      <option value="854x480">854x480 (SD)</option>
                      <option value="640x360">640x360 (360p)</option>
                      <option value="426x240">426x240 (240p)</option>
                    </optgroup>
                    
                    {/* Resoluciones verticales */}
                    <optgroup label="📱 Verticales (9:16)">
                      <option value="1080x1920">1080x1920 (Full HD Vertical)</option>
                      <option value="720x1280">720x1280 (HD Vertical)</option>
                      <option value="480x854">480x854 (SD Vertical)</option>
                      <option value="360x640">360x640 (360p Vertical)</option>
                      <option value="240x426">240x426 (240p Vertical)</option>
                    </optgroup>
                    
                    {/* Resoluciones cuadradas */}
                    <optgroup label="⬜ Cuadradas (1:1)">
                      <option value="1080x1080">1080x1080 (Instagram Square)</option>
                      <option value="720x720">720x720 (HD Square)</option>
                      <option value="480x480">480x480 (SD Square)</option>
                    </optgroup>
                    
                    {/* Resoluciones para redes sociales */}
                    <optgroup label="📺 Redes Sociales">
                      <option value="1080x1350">1080x1350 (Instagram Story)</option>
                      <option value="1080x1080">1080x1080 (Instagram Post)</option>
                      <option value="1080x1920">1080x1920 (TikTok/YouTube Shorts)</option>
                      <option value="1920x1080">1920x1080 (YouTube)</option>
                      <option value="1280x720">1280x720 (YouTube HD)</option>
                    </optgroup>
                    
                    <option value="custom">Personalizado</option>
                  </select>
                  
                  {resolution === 'custom' && (
                    <input
                      type="text"
                      placeholder="Ancho x Alto (ej: 1920x1080)"
                      value={customResolution.width && customResolution.height ? `${customResolution.width}x${customResolution.height}` : ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes('x')) {
                          const [width, height] = value.split('x');
                          setCustomResolution({ width: width.trim(), height: height.trim() });
                          setResolution(`custom:${width.trim()}x${height.trim()}`);
                        }
                      }}
                      className="custom-resolution-input"
                    />
                  )}
                </div>
              )}

              {/* Rotación y volteo */}
              {downloadFormat !== 'audio-only' && (
                <div className="control-group">
                  <label>Rotación</label>
                  <select
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="rotation-select"
                  >
                    <option value={0}>0° (Normal)</option>
                    <option value={90}>90° (Derecha)</option>
                    <option value={180}>180° (Invertido)</option>
                    <option value={270}>270° (Izquierda)</option>
                  </select>
                  
                  <div className="flip-options">
                    <label className="flip-option">
                      <input
                        type="checkbox"
                        checked={flipHorizontal}
                        onChange={(e) => setFlipHorizontal(e.target.checked)}
                      />
                      <span>H. Flip</span>
                    </label>
                    <label className="flip-option">
                      <input
                        type="checkbox"
                        checked={flipVertical}
                        onChange={(e) => setFlipVertical(e.target.checked)}
                      />
                      <span>V. Flip</span>
                    </label>
                  </div>
                </div>
              )}
            </div>


            {/* Botón de procesamiento */}
            <button
              className="process-btn"
              onClick={processVideo}
              disabled={isProcessing}
            >
              {isProcessing && <span className="loading"></span>}
              {isProcessing ? 'Procesando...' : '🎬 Procesar Vídeo'}
            </button>
          </div>
        )}

        {/* Mensajes de estado */}
        {error && <div className="error">❌ {error}</div>}
        {success && <div className="success">✅ {success}</div>}

        {/* Sección de descarga */}
        {processedFile && (
          <div className="download-section">
            <h3>🎉 ¡Vídeo procesado!</h3>
            <p>Tu vídeo está listo para descargar</p>
            <button className="download-btn" onClick={downloadFile}>
              📥 Descargar Vídeo
            </button>
          </div>
        )}
        
        {/* Canvas oculto para captura de pantalla */}
        <canvas 
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default App;
