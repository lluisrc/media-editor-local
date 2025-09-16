# 🎬 Editor de Media Local

<div align="center">

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue.svg)](https://github.com/yourusername/media-editor)
[![Python](https://img.shields.io/badge/python-3.8+-brightgreen.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-success.svg)]()

**🎥 Editor de video, imagen y audio LOCAL para Windows y Linux. Edita tus archivos multimedia sin límites ni spam, todo desde tu navegador**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-cómo-usar) • [Formatos Soportados](#-formatos-soportados)

</div>

---

## 📖 ¿Qué es Editor de Media Local?

**Editor de Media Local** es una aplicación web completamente **LOCAL** que se ejecuta en tu propia computadora (Windows o Linux). No necesitas conexión a internet después de la instalación - todo el procesamiento de tus archivos multimedia ocurre en tu máquina, manteniendo tu privacidad y sin límites de tamaño de archivos.

**¿Cansado de editores online con límites, marcas de agua y spam?** Esta es tu solución local, gratuita y sin restricciones.

---

## 📋 Requisitos del Sistema Local

### Para Windows
- **Windows 10/11** (64-bit recomendado)
- **Python 3.8+** instalado localmente
- **Node.js 16+** para la interfaz web
- **4 GB RAM** mínimo (8 GB recomendado para video 4K)
- **5 GB espacio libre** para la aplicación y archivos temporales
- **FFmpeg** (se instala automáticamente)

### Para Linux
- **Ubuntu 18.04+**, **Debian 10+**, **Fedora 30+**, o **Arch Linux**
- **Python 3.8+** (generalmente preinstalado)
- **Node.js 16+** 
- **4 GB RAM** mínimo (8 GB recomendado para video 4K)
- **5 GB espacio libre** para la aplicación y archivos temporales
- **FFmpeg** (se instala con el script de instalación)

---

## 🚀 Instalación Local

### 🪟 Instalación para Windows

#### Instalación Automática (Recomendada)
```bash
# 1. Descargar e instalar Python desde python.org
# 2. Descargar e instalar Node.js desde nodejs.org
# 3. Clonar o descargar este proyecto
# 4. Abrir PowerShell como administrador en la carpeta del proyecto

# 5. Ejecutar instalador automático (instala dependencias y FFmpeg)
.\init.bat

# 6. Iniciar la Aplicación Local
.\start.bat
```

### 🐧 Instalación para Linux

#### Instalación Automática (Recomendada)
```bash
# 1. Clonar o descargar este proyecto
# 2. Dar permisos de ejecución al instalador
chmod +x init.sh
chmod +x start.sh

# 3. Ejecutar instalador automático
./init.sh

# 4. Iniciar la Aplicación Local
./start.sh
```

---

### 🌐 Acceder a la Aplicación
1. **Abrir navegador web** (Chrome, Firefox, Edge, etc.)
2. **Ir a**: `http://localhost:3000`
3. **¡Listo!** Ya puedes editar tus archivos multimedia localmente

---

## 🎨 Cómo Usar el Editor

### 📤 Subir Archivos
1. **Arrastra y suelta** archivos en la zona de carga
2. **O haz clic** en "Seleccionar Archivos"
3. **Formatos soportados**: MP4, AVI, MOV, MP3, WAV, JPG, PNG, GIF y más
4. **Sin límites de tamaño**: Solo limitado por el espacio de tu disco

### ✂️ Editar Videos
- **🎬 Recortar**: Selecciona inicio y fin del video
- **⚡ Acelerar**: Velocidades de 1.25x hasta 4x
- **🐌 Ralentizar**: Velocidades de 0.25x hasta 0.75x
- **📏 Redimensionar**: Cambia resolución (4K, 1080p, 720p, etc.)
- **🔄 Cambiar formato**: Convierte entre MP4, AVI, MOV, MKV
- **🔊 Ajustar audio**: Cambiar volumen o extraer audio
- **🎭 Efectos básicos**: Brillo, contraste, saturación

### 🖼️ Editar Imágenes
- **✂️ Recortar**: Herramienta de recorte intuitiva
- **📐 Redimensionar**: Cambiar tamaño manteniendo proporciones
- **🔄 Rotar**: Giros de 90°, 180°, 270° o ángulo personalizado
- **🎨 Filtros**: Brillo, contraste, saturación, escala de grises
- **💾 Cambiar formato**: JPEG, PNG, WEBP, BMP
- **🗜️ Comprimir**: Optimizar tamaño de archivo

### 🎵 Editar Audio
- **✂️ Recortar**: Selecciona fragmentos de audio
- **🔊 Volumen**: Ajustar nivel de audio
- **⚡ Velocidad**: Acelerar o ralentizar sin cambiar tono
- **🔄 Formato**: Convierte entre MP3, WAV, AAC, OGG
- **🎚️ Normalizar**: Ajustar niveles automáticamente

### 💾 Exportar y Descargar
1. **Aplicar cambios**: Haz clic en "Procesar"
2. **Ver progreso**: Barra de progreso en tiempo real
3. **Descargar**: El archivo editado se descarga automáticamente
4. **Archivo original**: Se mantiene intacto, nunca se modifica

---

## ✨ Características de la Aplicación Local

### 🏠 Procesamiento Local
- **Servidor local**: Se ejecuta en `localhost` (tu computadora)
- **Interfaz web moderna**: Acceso desde tu navegador en `http://localhost:3000`
- **Procesamiento en tu máquina**: No se envía nada a internet
- **Archivos seguros**: Nunca salen de tu computadora

### 🚀 Editor Potente sin Límites
- **Sin límites de tamaño**: Solo limitado por tu espacio en disco
- **Sin marcas de agua**: Archivos limpios, 100% tuyos
- **Sin spam ni anuncios**: Interfaz limpia y profesional
- **Múltiples formatos**: Soporte amplio para video, audio e imagen
- **Calidad original**: No hay pérdida innecesaria de calidad
- **Procesamiento paralelo**: Edita múltiples archivos simultáneamente

### 🎨 Interfaz Web Local Moderna
- **Diseño intuitivo**: Fácil de usar para principiantes
- **Drag & Drop**: Arrastra archivos directamente
- **Preview en tiempo real**: Ve los cambios antes de procesar
- **Responsive design**: Funciona en cualquier tamaño de ventana
- **Progreso visual**: Barras de progreso detalladas

### 🔧 Arquitectura Local Robusta
- **Backend Python**: FastAPI con procesamiento FFmpeg
- **Frontend React**: Interfaz moderna y reactiva
- **API REST local**: Comunicación eficiente
- **WebSockets**: Updates en tiempo real del progreso

---

## 📁 Formatos Soportados

### 🎥 Video (Entrada)
- **MP4**, **AVI**, **MOV**, **MKV**, **FLV**, **WMV**, **3GP**, **WEBM**

### 🎥 Video (Salida)
- **MP4** (recomendado), **AVI**, **MOV**, **MKV**, **WEBM**

### 🖼️ Imagen (Entrada)
- **JPEG/JPG**, **PNG**, **GIF**, **BMP**, **TIFF**, **WEBP**, **SVG**

### 🖼️ Imagen (Salida)  
- **JPEG/JPG**, **PNG**, **WEBP**, **BMP**

### 🎵 Audio (Entrada)
- **MP3**, **WAV**, **AAC**, **OGG**, **FLAC**, **M4A**, **WMA**

### 🎵 Audio (Salida)
- **MP3**, **WAV**, **AAC**, **OGG**

---

## 🏠 ¿Por qué LOCAL?

### 🔒 Ventajas de Privacidad:
- **🔐 100% Privado**: Tus archivos NUNCA salen de tu computadora
- **🚫 Sin nubes**: No se suben archivos a servidores externos
- **⚡ Sin límites**: Procesa archivos de cualquier tamaño
- **💰 Completamente GRATIS**: Sin suscripciones ni pagos ocultos
- **🎯 Sin spam**: Interfaz limpia, sin anuncios molestos

### 🚀 Ventajas Técnicas:
- **⚡ Más rápido**: Procesamiento local sin latencia de red
- **🔋 Eficiente**: Usa los recursos de tu computadora al máximo
- **📶 Funciona offline**: No necesitas internet después de instalar
- **💾 Control total**: Decides dónde guardar tus archivos
- **🔄 Sin interrupciones**: No depende de servidores externos

### 🎯 ¿Para qué sirve?

- **📱 Content creators**: Edita videos para redes sociales sin límites
- **🎬 Proyectos personales**: Edita videos familiares y recuerdos
- **📚 Material educativo**: Procesa contenido para cursos o presentaciones
- **🎵 Podcasters**: Edita y mejora tus grabaciones de audio
- **📸 Fotógrafos**: Procesa y optimiza imágenes por lotes
- **💼 Uso profesional**: Herramienta confiable sin depender de internet

---

## ⚡ Consejos de Optimización

### 🎬 Para Videos:
- **Usa MP4** para mejor compatibilidad
- **Reduce resolución** si el archivo es muy grande
- **Ajusta bitrate** según tu necesidad (calidad vs tamaño)
- **Procesa por segmentos** videos muy largos

### 🖼️ Para Imágenes:
- **JPEG para fotos**, PNG para gráficos con transparencia
- **WEBP** para mejor compresión en web
- **Redimensiona** antes de aplicar filtros para mayor velocidad

### 🎵 Para Audio:
- **MP3 320kbps** para calidad alta
- **MP3 128kbps** para archivos más pequeños
- **WAV** solo si necesitas calidad sin pérdida

---

## 🛡️ Privacidad y Seguridad Local

### 🔒 Ventajas de Privacidad:
- **Sin telemetría**: No se envían datos de uso
- **Sin logs externos**: No se registran tus archivos
- **Sin cuentas**: No necesitas registrarte
- **Control absoluto**: Tú decides qué procesar y cómo

### 🛡️ Seguridad Local:
- **Solo localhost**: Solo accesible desde tu PC
- **Sin exposición web**: No visible desde internet
- **Archivos temporales**: Se borran automáticamente
- **Código abierto**: Puedes revisar todo el código

---

## ⚠️ Uso Responsable

### 📋 Términos de Uso:
- **Archivos propios**: Solo edita contenido que te pertenece
- **Respeta derechos**: No edites contenido protegido sin permiso
- **Uso personal**: Para proyectos personales y educativos
- **Responsabilidad**: El usuario es responsable del contenido procesado

### ✅ Usos Apropiados:
- Videos y fotos personales
- Contenido propio para redes sociales
- Material educativo con licencia libre
- Archivos de dominio público
- Proyectos creativos personales

---

## 🆘 Soporte y Comunidad

¿Necesitas ayuda? Aquí tienes varias opciones:

- **🐛 Reportar bugs**: Abre un issue en GitHub
- **💡 Sugerir características**: Crea una feature request
- **📖 Documentación**: Consulta la wiki del proyecto
- **💬 Discusiones**: Únete a las discusiones de GitHub

---

## 🔄 Actualizaciones

Para mantener tu editor actualizado:

```bash
# 1. Descargar la nueva versión
# 2. Hacer backup de tus archivos personales
# 3. Ejecutar de nuevo el instalador
./init.sh    # Linux
init.bat     # Windows
```

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 🙏 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Abre** un Pull Request

---

<div align="center">
**🎬 Un editor de media local, potente y sin límites para tu computadora**

⭐ **¡Dale una estrella si te resultó útil!** ⭐

[⬆️ Volver arriba](#-editor-de-media-local)
</div>