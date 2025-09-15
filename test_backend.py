#!/usr/bin/env python3
"""
Script de prueba para verificar el funcionamiento del backend
"""
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Probando backend de Media Editor...")
    print("=" * 50)
    
    # Test 1: Verificar que el servidor esté funcionando
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Servidor funcionando: {response.json()}")
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        return False
    
    # Test 2: Verificar estado de salud
    try:
        response = requests.get(f"{base_url}/health")
        health_data = response.json()
        print(f"✅ Estado de salud: {health_data}")
        
        if not health_data.get("ffmpeg_available", False):
            print("⚠️  ADVERTENCIA: FFmpeg no está disponible")
    except Exception as e:
        print(f"❌ Error verificando salud: {e}")
    
    # Test 3: Probar endpoint de procesamiento con datos de prueba
    try:
        test_data = {
            "file_id": "test-123",
            "start_time": 0,
            "end_time": 10,
            "speed": 1.0
        }
        
        response = requests.post(f"{base_url}/process", json=test_data)
        print(f"📊 Respuesta del endpoint /process: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Endpoint funcionando (archivo no encontrado, como se esperaba)")
        else:
            print(f"📝 Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error probando endpoint de procesamiento: {e}")
    
    print("=" * 50)
    print("✅ Pruebas completadas")
    return True

if __name__ == "__main__":
    test_backend()
