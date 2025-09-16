import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // 'video' or 'audio'
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('video+audio');
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [audioOutputFormat, setAudioOutputFormat] = useState('mp3');
  const [resolution, setResolution] = useState('');
  const [customResolution, setCustomResolution] = useState({ width: '', height: '' });
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // Audio-specific states
  const [volume, setVolume] = useState(1.0);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Estados para gestión de archivos
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [showFileManagement, setShowFileManagement] = useState(false);
  
  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'uploaded' o 'processed'
  const [selectedFileInModal, setSelectedFileInModal] = useState(null);
  
  // Estado para carga de video
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const canvasRef = useRef(null);

  // Cargar archivos al inicio
  useEffect(() => {
    loadFiles();
  }, []);

  // Detectar cuando el video se ha cargado
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoading(false);
    };

    const handleError = () => {
      setIsVideoLoading(false);
      setError('Error al cargar el video');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  // Detectar cuando el audio se ha cargado
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsAudioLoading(false);
    };

    const handleError = () => {
      setIsAudioLoading(false);
      setError('Error al cargar el audio');
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  // Efectos para control de vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    console.log('Configurando event listeners para video:', videoUrl);

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
      console.log('Video metadata cargado, duración:', video.duration);
      setVideoDuration(video.duration);
      setEndTime(video.duration);
    };

    const handlePlay = () => {
      console.log('Video play');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Video pause');
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      console.log('Limpiando event listeners');
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, endTime, startTime]);

  // Efectos para control de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    console.log('Configurando event listeners para audio:', audioUrl);

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Pausar audio cuando llegue al punto de corte final
      if (endTime && audio.currentTime >= endTime) {
        audio.pause();
        setIsPlaying(false);
      }
      
      // Pausar audio si está antes del punto de inicio (si hay selección)
      if (startTime > 0 && audio.currentTime < startTime) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata cargado, duración:', audio.duration);
      setAudioDuration(audio.duration);
      setEndTime(audio.duration);
    };

    const handlePlay = () => {
      console.log('Audio play');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Audio pause');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      console.log('Limpiando event listeners de audio');
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, endTime, startTime]);

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
    const audio = audioRef.current;
    
    if (video) {
      video.playbackRate = speed;
    }
    if (audio) {
      audio.playbackRate = speed;
    }
  }, [speed]);

  // Efecto para aplicar volumen en tiempo real
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    // Limitar el volumen del elemento HTML a máximo 1.0
    const htmlVolume = Math.min(volume, 1.0);
    
    if (video) {
      video.volume = htmlVolume;
    }
    if (audio) {
      audio.volume = htmlVolume;
    }
  }, [volume]);

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
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setProcessedFile(null);
      
      // Determinar tipo de archivo
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      
      setFileType(isVideo ? 'video' : 'audio');
      
      // Mostrar spinner de carga
      if (isVideo) {
        setIsVideoLoading(true);
      } else {
        setIsAudioLoading(true);
      }
      
      // Crear URL para preview
      const url = URL.createObjectURL(file);
      if (isVideo) {
        setVideoUrl(url);
        setAudioUrl(null);
      } else {
        setAudioUrl(url);
        setVideoUrl(null);
      }
      
      // Resetear controles
      setStartTime(0);
      setEndTime(null);
      setSpeed(1.0);
      setVolume(1.0);
      setFadeIn(0);
      setFadeOut(0);
      
      // Configurar formato de descarga según tipo de archivo
      if (isAudio) {
        setDownloadFormat('audio-only');
      } else {
        setDownloadFormat('video+audio');
      }
      
      // Subir archivo al servidor
      uploadFile(file);
    } else {
      setError('Por favor selecciona un archivo de vídeo o audio válido');
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
        output_format: fileType === 'video' ? outputFormat : audioOutputFormat,
        resolution: resolution || null,
        rotation: rotation,
        flip_horizontal: flipHorizontal,
        flip_vertical: flipVertical,
        // Audio-specific parameters
        volume: volume,
        fade_in: fadeIn,
        fade_out: fadeOut
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

  const processAndDownload = async () => {
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
        output_format: fileType === 'video' ? outputFormat : audioOutputFormat,
        resolution: resolution || null,
        rotation: rotation,
        flip_horizontal: flipHorizontal,
        flip_vertical: flipVertical,
        // Audio-specific parameters
        volume: volume,
        fade_in: fadeIn,
        fade_out: fadeOut
      };

      const response = await axios.post(`${API_BASE_URL}/process`, processData);
      const outputFilename = response.data.output_filename;

      // Descargar automáticamente
      const downloadUrl = `${API_BASE_URL}/download/${outputFilename}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = outputFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProcessedFile(outputFilename);
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

  // Funciones para gestión de archivos
  const loadFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      const files = response.data.files;
      
      const uploaded = files.filter(file => file.type === 'uploaded');
      const processed = files.filter(file => file.type === 'processed');
      
      setUploadedFiles(uploaded);
      setProcessedFiles(processed);
    } catch (error) {
      setError('Error al cargar archivos: ' + (error.response?.data?.detail || error.message));
    }
  };

  const selectUploadedFile = (file) => {
    setFileId(file.file_id);
    setFileName(file.filename);
    
    // Determinar tipo de archivo basado en la extensión
    const isVideo = /\.(mp4|avi|mov|mkv|webm|flv)$/i.test(file.filename);
    const isAudio = /\.(mp3|wav|flac|aac|ogg|m4a)$/i.test(file.filename);
    
    setFileType(isVideo ? 'video' : 'audio');
    
    // Mostrar spinner de carga
    if (isVideo) {
      setIsVideoLoading(true);
    } else {
      setIsAudioLoading(true);
    }
    
    // Resetear controles de edición primero
    setStartTime(0);
    setEndTime(null);
    setSpeed(1.0);
    setVolume(1.0);
    setFadeIn(0);
    setFadeOut(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoDuration(0);
    setAudioDuration(0);
    
    // Configurar formato de descarga según tipo de archivo
    if (isAudio) {
      setDownloadFormat('audio-only');
    } else {
      setDownloadFormat('video+audio');
    }
    
    // Crear URL del archivo para el reproductor
    const fileUrl = `${API_BASE_URL}/uploads/${file.filename}`;
    if (isVideo) {
      setVideoUrl(fileUrl);
      setAudioUrl(null);
    } else {
      setAudioUrl(fileUrl);
      setVideoUrl(null);
    }
    
    // Crear objeto de archivo simulado para compatibilidad
    const mockFile = {
      name: file.filename,
      size: file.size,
      type: isVideo ? 'video/mp4' : 'audio/mp3'
    };
    setSelectedFile(mockFile);
    
    setSuccess(`Archivo seleccionado: ${file.filename}`);
    setShowFileManagement(false);
  };

  const downloadProcessedFile = (filename) => {
    const downloadUrl = `${API_BASE_URL}/download/${filename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFile = async (fileType, filename, showConfirmation = true) => {
    if (showConfirmation && !window.confirm(`¿Estás seguro de que quieres eliminar ${filename}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/files/${fileType}/${filename}`);
      await loadFiles(); // Recargar lista
      if (showConfirmation) {
        setSuccess(`Archivo ${filename} eliminado correctamente`);
      }
    } catch (error) {
      setError('Error al eliminar archivo: ' + (error.response?.data?.detail || error.message));
    }
  };

  const cleanupAllFiles = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los archivos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/files/cleanup`);
      await loadFiles(); // Recargar lista
      setSuccess(response.data.message);
    } catch (error) {
      setError('Error al limpiar archivos: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Funciones para modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setSelectedFileInModal(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedFileInModal(null);
  };

  const selectFileInModal = (file) => {
    setSelectedFileInModal(file);
  };

  const confirmSelection = () => {
    if (selectedFileInModal && modalType === 'uploaded') {
      selectUploadedFile(selectedFileInModal);
    }
    closeModal();
  };

  const getVideoPreviewUrl = (file) => {
    if (modalType === 'uploaded') {
      return `${API_BASE_URL}/uploads/${file.filename}`;
    } else {
      return `${API_BASE_URL}/download/${file.filename}`;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Funciones de control de audio/video
  const togglePlayPause = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    const media = video || audio;
    
    if (media) {
      if (media.paused) {
        // Si hay una selección y el media está fuera del rango, ir al inicio
        if (startTime > 0 && media.currentTime < startTime) {
          media.currentTime = startTime;
        }
        media.play();
      } else {
        media.pause();
      }
    }
  };

  const seekTo = (time) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    const media = video || audio;
    
    if (media) {
      media.currentTime = time;
    }
  };

  const goToStartOfSelection = () => {
    seekTo(startTime);
  };

  const goToEndOfSelection = () => {
    const duration = fileType === 'video' ? videoDuration : audioDuration;
    seekTo(endTime || duration);
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
    const duration = fileType === 'video' ? videoDuration : audioDuration;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  const handleStartTimeDrag = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const duration = fileType === 'video' ? videoDuration : audioDuration;
    const newTime = percentage * duration;
    
    if (newTime < (endTime || duration)) {
      setStartTime(newTime);
    }
  };

  const handleEndTimeDrag = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const duration = fileType === 'video' ? videoDuration : audioDuration;
    const newTime = percentage * duration;
    
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

  const getAudioDuration = () => {
    if (audioRef.current) {
      return audioRef.current.duration;
    }
    return 0;
  };

  const handleVideoLoaded = () => {
    const duration = getVideoDuration();
    setEndTime(duration);
  };

  const handleAudioLoaded = () => {
    const duration = getAudioDuration();
    setEndTime(duration);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎵🎬 Media Editor</h1>
        <p>Edita tus audios y vídeos de forma sencilla y rápida</p>
      </div>

      <div className="main-content">
        {/* Sección de carga */}
        <div 
          className={`upload-section ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">🎵🎬</div>
          <div className="upload-text">
            Arrastra tu audio o vídeo aquí o haz clic para seleccionar
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="file-input"
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar Audio/Video
          </button>
        </div>

        {/* Botones discretos de gestión de archivos */}
        <div className="discrete-file-buttons">
          <button 
            className="discrete-modal-trigger-btn discrete-uploaded-btn"
            onClick={() => openModal('uploaded')}
          >
            📁 Archivos Subidos ({uploadedFiles.length})
          </button>
          <button 
            className="discrete-modal-trigger-btn discrete-processed-btn"
            onClick={() => openModal('processed')}
          >
            🎵🎬 Archivos Procesados ({processedFiles.length})
          </button>
        </div>

        {/* Información del archivo */}
        {selectedFile && (
          <div className="file-info">
            <h3>{fileType === 'video' ? '🎬' : '🎵'} Archivo seleccionado</h3>
            <p><strong>Nombre:</strong> {selectedFile.name}</p>
            <p><strong>Tamaño:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p><strong>Tipo:</strong> {fileType === 'video' ? 'Video' : 'Audio'} - {selectedFile.type}</p>
          </div>
        )}

        {/* Preview del vídeo con controles avanzados */}
        {videoUrl && (
          <div className="video-preview">
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoUrl}
                crossOrigin="anonymous"
                onLoadedMetadata={handleVideoLoaded}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
                className="main-video"
              />
              
              {/* Spinner de carga */}
              {isVideoLoading && (
                <div className="video-loading-overlay">
                  <div className="video-loading-spinner">
                    <div className="spinner"></div>
                    <div className="spinner-text">Cargando video...</div>
                  </div>
                </div>
              )}
              
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

        {/* Preview del audio con controles avanzados */}
        {audioUrl && (
          <div className="audio-preview">
            <div className="audio-container">
              <div className="audio-visualizer">
                <div className="audio-waveform">
                  <div className="waveform-bars">
                    {Array.from({ length: 50 }, (_, i) => (
                      <div 
                        key={i} 
                        className="waveform-bar"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="audio-info">
                  <div className="audio-title">🎵 {selectedFile?.name}</div>
                  <div className="audio-duration">
                    {formatTime(currentTime)} / {formatTime(audioDuration)}
                  </div>
                </div>
              </div>
              
              <audio
                ref={audioRef}
                src={audioUrl}
                crossOrigin="anonymous"
                onLoadedMetadata={handleAudioLoaded}
                className="main-audio"
              />
              
              {/* Spinner de carga */}
              {isAudioLoading && (
                <div className="audio-loading-overlay">
                  <div className="audio-loading-spinner">
                    <div className="spinner"></div>
                    <div className="spinner-text">Cargando audio...</div>
                  </div>
                </div>
              )}
              
              {/* Controles personalizados */}
              <div className="audio-controls">
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
                
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(audioDuration)}
                  {speed !== 1.0 && (
                    <span className="speed-indicator">
                      ⚡ {speed}x
                    </span>
                  )}
                  {(startTime > 0 || (endTime && endTime < audioDuration)) && (
                    <span className="selection-mode-indicator">
                      🎵 Modo Selección
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
                      style={{ width: `${(currentTime / audioDuration) * 100}%` }}
                    />
                    
                    {/* Marcador de inicio */}
                    <div 
                      className="start-marker"
                      style={{ left: `${(startTime / audioDuration) * 100}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingStart(true);
                      }}
                    />
                    
                    {/* Marcador de fin */}
                    <div 
                      className="end-marker"
                      style={{ left: `${((endTime || audioDuration) / audioDuration) * 100}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingEnd(true);
                      }}
                    />
                    
                    {/* Área de selección */}
                    <div 
                      className="selection-area"
                      style={{
                        left: `${(startTime / audioDuration) * 100}%`,
                        width: `${(((endTime || audioDuration) - startTime) / audioDuration) * 100}%`
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
                {formatTime(startTime)} - {formatTime(endTime || (fileType === 'video' ? videoDuration : audioDuration))}
              </span>
              <span className="selection-duration">
                {formatTime((endTime || (fileType === 'video' ? videoDuration : audioDuration)) - startTime)}
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
                    max={fileType === 'video' ? videoDuration : audioDuration}
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
                    max={fileType === 'video' ? videoDuration : audioDuration}
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

            {/* Controles de audio específicos */}
            {fileType === 'audio' && (
              <div className="audio-controls-row">
                <div className="volume-controls">
                  <label>Volumen</label>
                  <div className="volume-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                    <span className="volume-value">
                      {Math.round(volume * 100)}%
                      {volume > 1.0 && (
                        <span className="volume-note"> (Preview: 100%)</span>
                      )}
                    </span>
                  </div>
                  <div className="volume-info">
                    <small>El preview se limita a 100%, pero el volumen real se aplicará al procesar</small>
                  </div>
                </div>
                
                <div className="fade-controls">
                  <label>Fade In/Out</label>
                  <div className="fade-inputs">
                    <div className="fade-input-group">
                      <label>Fade In (s)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={fadeIn}
                        onChange={(e) => setFadeIn(parseFloat(e.target.value) || 0)}
                        className="fade-input"
                      />
                    </div>
                    <div className="fade-input-group">
                      <label>Fade Out (s)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={fadeOut}
                        onChange={(e) => setFadeOut(parseFloat(e.target.value) || 0)}
                        className="fade-input"
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            )}

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
              {downloadFormat !== 'audio-only' && fileType === 'video' && (
                <div className="control-group">
                  <label>Formato Video</label>
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

              {/* Formato de salida para audio */}
              {fileType === 'audio' && (
                <div className="control-group">
                  <label>Formato Audio</label>
                  <select
                    value={audioOutputFormat}
                    onChange={(e) => setAudioOutputFormat(e.target.value)}
                    className="format-select"
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                    <option value="aac">AAC</option>
                    <option value="ogg">OGG</option>
                    <option value="m4a">M4A</option>
                  </select>
                </div>
              )}

              {/* Resolución */}
              {downloadFormat !== 'audio-only' && fileType === 'video' && (
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
              {downloadFormat !== 'audio-only' && fileType === 'video' && (
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


            {/* Botón de procesamiento y descarga */}
            <button
              className="process-btn"
              onClick={processAndDownload}
              disabled={isProcessing}
            >
              {isProcessing && <span className="loading"></span>}
              {isProcessing ? 'Procesando...' : `${fileType === 'video' ? '🎬' : '🎵'} Procesar y Descargar`}
            </button>
          </div>
        )}

        {/* Mensajes de estado */}
        {error && <div className="error">❌ {error}</div>}
        
        {/* Modal de selección de archivos */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalType === 'uploaded' ? '📁 Archivos Subidos' : '🎵🎬 Archivos Procesados'}
                </h2>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>

              <div className="modal-grid">
                {(modalType === 'uploaded' ? uploadedFiles : processedFiles).map((file, index) => (
                  <div 
                    key={index} 
                    className={`file-card ${selectedFileInModal?.filename === file.filename ? 'selected' : ''}`}
                    onClick={() => selectFileInModal(file)}
                  >
                    <div className="file-preview">
                      {modalType === 'uploaded' ? (
                        <video 
                          src={getVideoPreviewUrl(file)}
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <video 
                          src={getVideoPreviewUrl(file)}
                          muted
                          preload="metadata"
                        />
                      )}
                    </div>
                    
                    <div className="file-info">
                      <div className="file-name">{file.filename}</div>
                      <div className="file-size">{file.size_mb} MB</div>
                    </div>

                    <div className="file-actions">
                      {modalType === 'uploaded' ? (
                        <>
                          <button 
                            className="file-action-btn select-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectUploadedFile(file);
                              closeModal();
                            }}
                          >
                            Seleccionar
                          </button>
                          <button 
                            className="file-action-btn delete-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile('uploaded', file.filename);
                            }}
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="file-action-btn download-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadProcessedFile(file.filename);
                            }}
                          >
                            Descargar
                          </button>
                          <button 
                            className="file-action-btn delete-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile('processed', file.filename);
                            }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {modalType === 'uploaded' && (modalType === 'uploaded' ? uploadedFiles : processedFiles).length === 0 && (
                <div className="empty-state">
                  No hay archivos subidos
                </div>
              )}

              {modalType === 'processed' && (modalType === 'uploaded' ? uploadedFiles : processedFiles).length === 0 && (
                <div className="empty-state">
                  No hay archivos procesados
                </div>
              )}

              <div className="modal-footer">
                <div className="modal-stats">
                  Total: {(modalType === 'uploaded' ? uploadedFiles : processedFiles).length} archivos
                </div>
                <div className="modal-actions">
                  <button 
                    className="modal-btn modal-cleanup-btn" 
                    onClick={async () => {
                      const fileType = modalType === 'uploaded' ? 'subidos' : 'procesados';
                      const fileCount = modalType === 'uploaded' ? uploadedFiles.length : processedFiles.length;
                      
                      if (window.confirm(`¿Estás seguro de que quieres eliminar TODOS los ${fileCount} archivos ${fileType}? Esta acción no se puede deshacer.`)) {
                        try {
                          // Eliminar todos los archivos de una vez
                          const filesToDelete = modalType === 'uploaded' ? uploadedFiles : processedFiles;
                          
                          for (const file of filesToDelete) {
                            await axios.delete(`${API_BASE_URL}/files/${modalType}/${file.filename}`);
                          }
                          
                          setSuccess(`${fileCount} archivos ${fileType} eliminados correctamente`);
                          await loadFiles(); // Recargar lista
                          closeModal();
                        } catch (error) {
                          setError('Error al eliminar archivos: ' + (error.response?.data?.detail || error.message));
                        }
                      }
                    }}
                  >
                    🗑️ Limpiar Todo
                  </button>
                  <button className="modal-btn modal-cancel-btn" onClick={closeModal}>
                    Cancelar
                  </button>
                  {modalType === 'uploaded' && selectedFileInModal && (
                    <button className="modal-btn modal-confirm-btn" onClick={confirmSelection}>
                      Seleccionar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas oculto para captura de pantalla */}
        <canvas 
          ref={canvasRef}
          style={{ display: 'none' }}
        />
        
        {/* Audio oculto para reproducción */}
        <audio 
          ref={audioRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default App;
