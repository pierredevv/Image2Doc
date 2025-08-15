@echo off
echo 🚀 Iniciando servidor backend...

:: Activar entorno virtual (usar el venv correcto)
call .venv\Scripts\activate.bat

:: Cambiar al directorio backend
cd backend

echo 📍 Backend iniciándose en: http://127.0.0.1:8000
echo 📍 Documentación API: http://127.0.0.1:8000/docs
echo 🔄 Presiona Ctrl+C para detener

:: Ejecutar servidor usando el script optimizado
python run_backend.py
pause
