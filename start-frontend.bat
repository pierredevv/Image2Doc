@echo off
echo 🌐 Iniciando servidor frontend...

:: Cambiar al directorio frontend
cd frontend

echo 📍 Frontend iniciándose en: http://localhost:3000
echo 🔄 Presiona Ctrl+C para detener

:: Ejecutar servidor de desarrollo
npm run dev
pause
