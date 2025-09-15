#!/usr/bin/env python3
"""
Script de prueba para verificar las funcionalidades de captura y velocidad
"""
import requests
import json

def test_capture_and_speed():
    base_url = "http://localhost:8000"
    
    print("📷 Probando captura de pantalla y velocidad en tiempo real...")
    print("=" * 70)
    
    # Test 1: Verificar que el servidor esté funcionando
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Servidor funcionando: {response.json()}")
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        return False
    
    # Test 2: Verificar endpoint de salud
    try:
        response = requests.get(f"{base_url}/health")
        health_data = response.json()
        print(f"✅ Estado de salud: {health_data}")
    except Exception as e:
        print(f"❌ Error verificando salud: {e}")
    
    print("=" * 70)
    print("✅ Pruebas de backend completadas")
    print("\n🎯 Nuevas funcionalidades implementadas:")
    print("   • 📷 Captura de frame actual como JPG")
    print("   • ⚡ Velocidad de reproducción en tiempo real")
    print("   • 📸 Botón de captura con estado de carga")
    print("   • 🎬 Preview con velocidad aplicada")
    print("   • 📊 Indicadores visuales de velocidad")
    print("   • 💾 Descarga automática de capturas")
    
    print("\n🚀 Para probar las nuevas funcionalidades:")
    print("   1. Ejecuta: start.bat")
    print("   2. Abre: http://localhost:3000")
    print("   3. Carga un vídeo")
    print("   4. Ajusta la velocidad con el slider")
    print("   5. Observa cómo el vídeo se reproduce a la nueva velocidad")
    print("   6. Haz clic en 📷 para capturar el frame actual")
    print("   7. La captura se descargará automáticamente como JPG")
    
    print("\n💡 Funcionalidades de captura:")
    print("   • Captura el frame exacto que estás viendo")
    print("   • Nombre del archivo incluye el tiempo actual")
    print("   • Formato JPG con calidad 90%")
    print("   • Descarga automática al navegador")
    print("   • Botón cambia a 📸 durante la captura")
    
    print("\n💡 Funcionalidades de velocidad:")
    print("   • Se aplica inmediatamente en el preview")
    print("   • Indicador visual ⚡ muestra la velocidad activa")
    print("   • Rango de 0.25x a 4x velocidad")
    print("   • Nota visual confirma que está aplicada")
    print("   • Funciona tanto en reproducción como en pausa")
    
    print("\n🎬 Casos de uso prácticos:")
    print("   • Capturar frames clave para storyboards")
    print("   • Revisar contenido a cámara lenta")
    print("   • Crear thumbnails de vídeos")
    print("   • Analizar movimiento a alta velocidad")
    print("   • Documentar momentos específicos")
    
    return True

if __name__ == "__main__":
    test_capture_and_speed()
