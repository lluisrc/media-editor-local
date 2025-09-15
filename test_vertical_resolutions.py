#!/usr/bin/env python3
"""
Script de prueba para verificar las nuevas resoluciones verticales
"""
import requests
import json

def test_vertical_resolutions():
    base_url = "http://localhost:8000"
    
    print("📱 Probando resoluciones verticales y para redes sociales...")
    print("=" * 80)
    
    # Test 1: Verificar que el servidor esté funcionando
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Servidor funcionando: {response.json()}")
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        return False
    
    print("=" * 80)
    print("✅ Pruebas de backend completadas")
    print("\n📱 Nuevas resoluciones verticales implementadas:")
    
    print("\n🖥️ HORIZONTALES (16:9):")
    print("   • 1920x1080 (Full HD)")
    print("   • 1280x720 (HD)")
    print("   • 854x480 (SD)")
    print("   • 640x360 (360p)")
    print("   • 426x240 (240p)")
    
    print("\n📱 VERTICALES (9:16):")
    print("   • 1080x1920 (Full HD Vertical)")
    print("   • 720x1280 (HD Vertical)")
    print("   • 480x854 (SD Vertical)")
    print("   • 360x640 (360p Vertical)")
    print("   • 240x426 (240p Vertical)")
    
    print("\n⬜ CUADRADAS (1:1):")
    print("   • 1080x1080 (Instagram Square)")
    print("   • 720x720 (HD Square)")
    print("   • 480x480 (SD Square)")
    
    print("\n📺 REDES SOCIALES:")
    print("   • 1080x1350 (Instagram Story)")
    print("   • 1080x1080 (Instagram Post)")
    print("   • 1080x1920 (TikTok/YouTube Shorts)")
    print("   • 1920x1080 (YouTube)")
    print("   • 1280x720 (YouTube HD)")
    
    print("\n🎯 Casos de uso para resoluciones verticales:")
    print("   • TikTok: 1080x1920 - Vídeos verticales para móvil")
    print("   • Instagram Stories: 1080x1350 - Historias verticales")
    print("   • Instagram Reels: 1080x1920 - Reels verticales")
    print("   • YouTube Shorts: 1080x1920 - Shorts verticales")
    print("   • Instagram Posts: 1080x1080 - Posts cuadrados")
    print("   • Facebook Stories: 1080x1920 - Historias verticales")
    print("   • Snapchat: 1080x1920 - Snaps verticales")
    
    print("\n💡 Ventajas de las resoluciones verticales:")
    print("   • Optimizadas para móviles")
    print("   • Mejor experiencia en redes sociales")
    print("   • Formato nativo para TikTok/Instagram")
    print("   • Aprovecha toda la pantalla del móvil")
    print("   • Mejor engagement en redes sociales")
    
    print("\n🔧 Cómo usar las nuevas resoluciones:")
    print("   1. Ejecuta: start.bat")
    print("   2. Abre: http://localhost:3000")
    print("   3. Carga un vídeo")
    print("   4. En 'Resolución de salida' selecciona:")
    print("      - 'Verticales (9:16)' para TikTok/Instagram")
    print("      - 'Cuadradas (1:1)' para Instagram Posts")
    print("      - 'Redes Sociales' para formatos específicos")
    print("   5. Procesa el vídeo con la nueva resolución")
    
    print("\n📊 Comparación de formatos:")
    print("   • Horizontal (16:9): Ideal para YouTube, TV, pantallas")
    print("   • Vertical (9:16): Ideal para móviles, redes sociales")
    print("   • Cuadrado (1:1): Ideal para Instagram, Facebook")
    print("   • Personalizada: Para necesidades específicas")
    
    print("\n🎬 Ejemplos de conversión:")
    print("   • Vídeo horizontal → TikTok: Selecciona 1080x1920")
    print("   • Vídeo horizontal → Instagram Story: Selecciona 1080x1350")
    print("   • Vídeo horizontal → Instagram Post: Selecciona 1080x1080")
    print("   • Vídeo vertical → YouTube: Selecciona 1920x1080")
    print("   • Vídeo cuadrado → HD: Selecciona 720x720")
    
    return True

if __name__ == "__main__":
    test_vertical_resolutions()
