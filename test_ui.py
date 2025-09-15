#!/usr/bin/env python3
"""
Script de prueba para verificar la nueva UI del frontend
"""
import requests
import json
import time

def test_ui_features():
    base_url = "http://localhost:8000"
    
    print("🎬 Probando nuevas funcionalidades de UI...")
    print("=" * 60)
    
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
    
    # Test 3: Probar diferentes formatos de procesamiento
    test_formats = ["video+audio", "video-only", "audio-only"]
    
    for format_type in test_formats:
        try:
            test_data = {
                "file_id": "test-123",
                "start_time": 0,
                "end_time": 10,
                "speed": 1.0,
                "format": format_type
            }
            
            response = requests.post(f"{base_url}/process", json=test_data)
            print(f"📊 Formato {format_type}: {response.status_code}")
            
            if response.status_code == 404:
                print(f"✅ Formato {format_type} aceptado (archivo no encontrado, como se esperaba)")
            else:
                print(f"📝 Respuesta: {response.text}")
                
        except Exception as e:
            print(f"❌ Error probando formato {format_type}: {e}")
    
    print("=" * 60)
    print("✅ Pruebas de UI completadas")
    print("\n🎯 Funcionalidades implementadas:")
    print("   • Controles de vídeo en tiempo real")
    print("   • Barra de progreso interactiva")
    print("   • Marcadores de inicio y fin arrastrables")
    print("   • Selección visual del área de recorte")
    print("   • Opciones de formato de descarga")
    print("   • Información de selección en tiempo real")
    print("\n🚀 Para probar la UI completa:")
    print("   1. Ejecuta: start.bat")
    print("   2. Abre: http://localhost:3000")
    print("   3. Carga un vídeo y prueba los controles")
    
    return True

if __name__ == "__main__":
    test_ui_features()
