#!/bin/bash
echo "===================================="
echo "   INSTALACION IMAGE2DOC PROJECT"
echo "===================================="
echo

echo "[1/4] Creando entorno virtual Python..."
cd backend
python3 -m venv venv
source venv/bin/activate

echo "[2/4] Instalando dependencias Python..."
pip install -r ../requirements.txt
pip install "uvicorn[standard]"

echo "[3/4] Instalando dependencias Node.js..."
cd ../frontend
npm install

echo "[4/4] Creando directorio temporal..."
cd ../backend
mkdir -p temp

echo
echo "===================================="
echo "   INSTALACION COMPLETADA!"
echo "===================================="
echo
echo "Para ejecutar el proyecto:"
echo "1. Ejecutar: ./start-backend.sh"
echo "2. Ejecutar: ./start-frontend.sh" 
echo "3. Abrir: http://localhost:5173"
echo
echo "IMPORTANTE: Instalar Tesseract OCR primero"
echo "macOS: brew install tesseract"
echo "Ubuntu: sudo apt install tesseract-ocr"
