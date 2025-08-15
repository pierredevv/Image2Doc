# 📋 GUÍA DE INSTALACIÓN - IMAGE2DOC

## 🔧 Requisitos Previos

### 1. Software Base
- **Python 3.8+** ([Descargar](https://www.python.org/downloads/))
- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **Git** ([Descargar](https://git-scm.com/))

### 2. Tesseract OCR (OBLIGATORIO)

#### Windows:
```bash
# Opción 1: Descarga directa
# https://github.com/UB-Mannheim/tesseract/wiki

# Opción 2: Chocolatey
choco install tesseract

# Opción 3: Winget
winget install UB-Mannheim.TesseractOCR
```

#### macOS:
```bash
brew install tesseract
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng
```

---

## 🚀 INSTALACIÓN RÁPIDA

### Windows:
```bash
# 1. Ejecutar instalación automática
install.bat

# 2. Crear archivo de configuración backend/.env
# (Ver sección de configuración)

# 3. Ejecutar proyecto
start-backend.bat    # En una terminal
start-frontend.bat   # En otra terminal
```

### macOS/Linux:
```bash
# 1. Dar permisos y ejecutar instalación
chmod +x *.sh
./install.sh

# 2. Crear archivo de configuración backend/.env
# (Ver sección de configuración)

# 3. Ejecutar proyecto
./start-backend.sh   # En una terminal
./start-frontend.sh  # En otra terminal
```

---

## ⚙️ CONFIGURACIÓN

### 1. Crear `backend/.env`

```env
# Configuración Tesseract
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
TESSDATA_PREFIX=C:\Program Files\Tesseract-OCR\tessdata

# Para macOS/Linux:
# TESSERACT_CMD=/usr/local/bin/tesseract
# TESSDATA_PREFIX=/usr/local/share/tessdata

# Servicios opcionales
# GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
# OCRSPACE_API_KEY=your_api_key_here

# Directorio temporal
TMP_DIR=./temp
```

---

## 📦 INSTALACIÓN MANUAL

### Backend (Python/FastAPI):

```bash
# 1. Ir al directorio backend
cd backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r ../requirements.txt
pip install "uvicorn[standard]"

# 5. Crear directorio temporal
mkdir temp
```

### Frontend (React/Vite):

```bash
# 1. Ir al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install
```

---

## 🏃‍♂️ EJECUTAR EL PROYECTO

### 1. Iniciar Backend:
```bash
cd backend
# Activar entorno virtual
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Ejecutar servidor
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 2. Iniciar Frontend:
```bash
cd frontend
npm run dev
```

### 3. Abrir en navegador:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

---

## 🧪 PROBAR EL PROYECTO

1. Abre http://localhost:5173
2. Selecciona un idioma (español, inglés, etc.)
3. Sube una imagen (PNG, JPG, JPEG - máx. 10MB)
4. Elige formato de salida (TXT, DOCX, XLSX)
5. Haz clic en "Convertir Documento"
6. El archivo se descargará automáticamente

---

## 📝 DEPENDENCIAS PRINCIPALES

### Backend:
- FastAPI (API web)
- Tesseract/PyTesseract (OCR)
- Google Cloud Vision (OCR avanzado - opcional)
- OpenCV (procesamiento de imágenes)
- python-docx (generación DOCX)
- openpyxl (generación XLSX)
- Pillow (manipulación de imágenes)

### Frontend:
- React 19 (interfaz de usuario)
- Vite (build tool)
- PropTypes (validación de props)
- TailwindCSS (estilos - incluido en CSS)

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### Error: "Tesseract not found"
- Verificar que Tesseract esté instalado
- Comprobar ruta en `backend/.env`
- En Windows, la ruta típica es: `C:\Program Files\Tesseract-OCR\tesseract.exe`

### Error: CORS
- Verificar que el backend esté ejecutándose en puerto 8000
- El frontend debe estar en puerto 5173 o 3000

### Error: "No se pudo extraer texto"
- Usar imágenes con texto claro y visible
- Probar con diferentes idiomas
- Verificar calidad de la imagen

### Error: Dependencias faltantes
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📞 SOPORTE

Si encuentras algún problema:
1. Verificar que todos los requisitos estén instalados
2. Comprobar que las rutas en `.env` sean correctas
3. Revisar los logs de error en la consola
4. Probar con imágenes de prueba simples

¡El proyecto ahora está listo para usar! 🎉
