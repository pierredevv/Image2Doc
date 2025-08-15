#!/usr/bin/env python3
"""
Script para probar el endpoint /api/convert con un archivo
"""

import requests
from PIL import Image, ImageDraw, ImageFont
import io

def create_test_image():
    """Crear una imagen de prueba con texto"""
    # Crear una imagen blanca con texto
    img = Image.new('RGB', (400, 200), color='white')
    draw = ImageDraw.Draw(img)
    
    # Agregar texto simple
    text = "Hola Mundo\nEsto es una prueba de OCR\n123456"
    try:
        # Intentar usar una fuente más grande
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        # Si no está disponible, usar la fuente por defecto
        font = ImageFont.load_default()
    
    draw.text((20, 50), text, fill='black', font=font)
    
    # Guardar como bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return img_bytes.getvalue()

def test_convert_api():
    """Probar el endpoint de conversión"""
    print("🔄 Creando imagen de prueba...")
    image_data = create_test_image()
    
    print("📤 Enviando request al backend...")
    
    # Preparar el archivo
    files = {
        'file': ('test_image.png', image_data, 'image/png')
    }
    
    data = {
        'output_format': 'txt',
        'lang': 'spa'
    }
    
    try:
        # Probar directamente el backend
        response = requests.post(
            'http://127.0.0.1:8000/api/convert',
            files=files,
            data=data,
            timeout=30
        )
        
        print(f"📥 Status Code: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Request exitoso!")
            print(f"📄 Tipo de contenido: {response.headers.get('content-type')}")
            # Guardar la respuesta
            with open('test_output.txt', 'wb') as f:
                f.write(response.content)
            print("💾 Respuesta guardada en test_output.txt")
        else:
            print("❌ Error en la request:")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_convert_api()

