#!/usr/bin/env python3
"""
Script para probar la conexión entre frontend y backend
"""

import requests
import json
import time
import sys

def test_backend_health():
    """Prueba la salud del backend"""
    print("🔍 Probando salud del backend...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend saludable: {data}")
            return True
        else:
            print(f"❌ Backend no saludable: HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend. ¿Está ejecutándose?")
        return False
    except Exception as e:
        print(f"❌ Error probando backend: {e}")
        return False

def test_languages_endpoint():
    """Prueba el endpoint de idiomas"""
    print("\n🌍 Probando endpoint de idiomas...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/api/languages", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Idiomas disponibles: {len(data.get('languages', []))} idiomas")
            return True
        else:
            print(f"❌ Error en endpoint de idiomas: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error probando idiomas: {e}")
        return False

def test_root_endpoint():
    """Prueba el endpoint raíz"""
    print("\n🏠 Probando endpoint raíz...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Endpoint raíz funcionando: {data.get('message', 'N/A')}")
            return True
        else:
            print(f"❌ Error en endpoint raíz: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error probando endpoint raíz: {e}")
        return False

def test_frontend_proxy():
    """Prueba si el frontend puede acceder al backend a través del proxy"""
    print("\n🌐 Probando proxy del frontend...")
    
    try:
        # Simular request desde el frontend
        response = requests.get("http://localhost:3000/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Proxy del frontend funcionando correctamente")
            return True
        else:
            print(f"❌ Error en proxy del frontend: HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al frontend. ¿Está ejecutándose?")
        return False
    except Exception as e:
        print(f"❌ Error probando proxy: {e}")
        return False

def test_cors():
    """Prueba la configuración CORS"""
    print("\n🔒 Probando configuración CORS...")
    
    try:
        # Simular request con origen del frontend
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options("http://127.0.0.1:8000/api/convert", headers=headers, timeout=10)
        
        if response.status_code == 200:
            cors_headers = response.headers
            print("✅ CORS configurado correctamente")
            print(f"   Access-Control-Allow-Origin: {cors_headers.get('Access-Control-Allow-Origin', 'N/A')}")
            print(f"   Access-Control-Allow-Methods: {cors_headers.get('Access-Control-Allow-Methods', 'N/A')}")
            return True
        else:
            print(f"❌ Error en CORS: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error probando CORS: {e}")
        return False

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas de conexión Image2Doc")
    print("=" * 50)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Languages Endpoint", test_languages_endpoint),
        ("Root Endpoint", test_root_endpoint),
        ("CORS Configuration", test_cors),
        ("Frontend Proxy", test_frontend_proxy)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Error ejecutando {test_name}: {e}")
            results.append((test_name, False))
    
    # Resumen de resultados
    print("\n" + "=" * 50)
    print("📊 RESUMEN DE PRUEBAS")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nResultado: {passed}/{total} pruebas pasaron")
    
    if passed == total:
        print("🎉 ¡Todas las pruebas pasaron! El sistema está funcionando correctamente.")
        return 0
    else:
        print("⚠️  Algunas pruebas fallaron. Revisa la configuración.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
