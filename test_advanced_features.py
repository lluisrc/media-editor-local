#!/usr/bin/env python3
"""
Script de prueba para verificar las funcionalidades avanzadas de conversión y edición
"""
import requests
import json

def test_advanced_features():
    base_url = "http://localhost:8000"
    
    print("🎬 Probando funcionalidades avanzadas de conversión y edición...")
    print("=" * 80)
    
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
    
    # Test 3: Probar diferentes formatos de salida
    test_formats = ["mp4", "mkv", "mov", "avi", "webm", "flv"]
    
    print("\n🔄 Probando conversión de formatos:")
    for fmt in test_formats:
        try:
            test_data = {
                "file_id": "test-123",
                "start_time": 0,
                "end_time": 10,
                "speed": 1.0,
                "format": "video+audio",
                "output_format": fmt
            }
            
            response = requests.post(f"{base_url}/process", json=test_data)
            print(f"   {fmt.upper()}: {response.status_code}")
            
        except Exception as e:
            print(f"   {fmt.upper()}: Error - {e}")
    
    # Test 4: Probar cambio de resolución
    print("\n📐 Probando cambio de resolución:")
    resolutions = ["1920x1080", "1280x720", "854x480", "640x360"]
    
    for res in resolutions:
        try:
            test_data = {
                "file_id": "test-123",
                "start_time": 0,
                "end_time": 10,
                "speed": 1.0,
                "format": "video+audio",
                "output_format": "mp4",
                "resolution": res
            }
            
            response = requests.post(f"{base_url}/process", json=test_data)
            print(f"   {res}: {response.status_code}")
            
        except Exception as e:
            print(f"   {res}: Error - {e}")
    
    # Test 5: Probar rotación y volteo
    print("\n🔄 Probando rotación y volteo:")
    rotations = [0, 90, 180, 270]
    
    for rot in rotations:
        try:
            test_data = {
                "file_id": "test-123",
                "start_time": 0,
                "end_time": 10,
                "speed": 1.0,
                "format": "video+audio",
                "output_format": "mp4",
                "rotation": rot,
                "flip_horizontal": rot % 2 == 1,
                "flip_vertical": rot > 180
            }
            
            response = requests.post(f"{base_url}/process", json=test_data)
            print(f"   Rotación {rot}°: {response.status_code}")
            
        except Exception as e:
            print(f"   Rotación {rot}°: Error - {e}")
    
    # Test 6: Probar recorte (crop)
    print("\n✂️ Probando recorte (crop):")
    crop_tests = [
        {"x": 0, "y": 0, "width": 100, "height": 100},
        {"x": 50, "y": 50, "width": 200, "height": 150},
        {"x": 100, "y": 100, "width": 300, "height": 200}
    ]
    
    for i, crop in enumerate(crop_tests):
        try:
            test_data = {
                "file_id": "test-123",
                "start_time": 0,
                "end_time": 10,
                "speed": 1.0,
                "format": "video+audio",
                "output_format": "mp4",
                "crop": crop
            }
            
            response = requests.post(f"{base_url}/process", json=test_data)
            print(f"   Crop {i+1}: {response.status_code}")
            
        except Exception as e:
            print(f"   Crop {i+1}: Error - {e}")
    
    print("=" * 80)
    print("✅ Pruebas de backend completadas")
    print("\n🎯 Nuevas funcionalidades implementadas:")
    print("   • 🔄 Conversión entre formatos (MP4, MKV, MOV, AVI, WebM, FLV)")
    print("   • 📐 Cambio de resolución (Full HD, HD, SD, 360p, 240p)")
    print("   • 🔄 Rotación (0°, 90°, 180°, 270°)")
    print("   • 🔄 Volteo horizontal y vertical")
    print("   • ✂️ Recorte (crop) de zonas específicas")
    print("   • 🎬 Combinación de múltiples transformaciones")
    print("   • 🎨 Interfaz intuitiva para todas las opciones")
    
    print("\n🚀 Para probar las nuevas funcionalidades:")
    print("   1. Ejecuta: start.bat")
    print("   2. Abre: http://localhost:3000")
    print("   3. Carga un vídeo")
    print("   4. Explora las nuevas opciones de conversión y edición")
    print("   5. Combina múltiples transformaciones")
    print("   6. Procesa y descarga el resultado")
    
    print("\n💡 Casos de uso prácticos:")
    print("   • Convertir vídeos entre formatos para compatibilidad")
    print("   • Redimensionar para diferentes dispositivos")
    print("   • Corregir orientación de vídeos grabados con móvil")
    print("   • Recortar zonas específicas para redes sociales")
    print("   • Crear múltiples versiones del mismo vídeo")
    
    return True

if __name__ == "__main__":
    test_advanced_features()
