@echo off
echo ====================================
echo    INSTALACION IMAGE2DOC PROJECT
echo ====================================
echo.

echo [1/4] Creando entorno virtual Python...
cd backend
python -m venv venv
call venv\Scripts\activate

echo [2/4] Instalando dependencias Python...
pip install -r ../requirements.txt
pip install "uvicorn[standard]"

echo [3/4] Instalando dependencias Node.js...
cd ../frontend
npm install

echo [4/4] Creando directorio temporal...
cd ../backend
mkdir temp 2>nul

echo.
echo ====================================
echo    INSTALACION COMPLETADA!
echo ====================================
echo.
echo Para ejecutar el proyecto:
echo 1. Ejecutar: start-backend.bat
echo 2. Ejecutar: start-frontend.bat
echo 3. Abrir: http://localhost:5173
echo.
echo IMPORTANTE: Instalar Tesseract OCR primero
echo https://github.com/UB-Mannheim/tesseract/wiki
pause
