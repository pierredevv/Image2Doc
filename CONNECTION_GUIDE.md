# 🚀 Guía de Conexión Frontend-Backend - Image2Doc

Esta guía te ayudará a conectar completamente el frontend con el backend para que el sistema OCR funcione correctamente.

## 📋 Requisitos Previos

- Python 3.8+ instalado
- Node.js 16+ instalado
- npm o yarn instalado
- Tesseract OCR instalado en el sistema
- Credenciales de Google Cloud Vision (opcional)

## 🔧 Configuración del Backend

### 1. Instalar Dependencias

```bash
# Activar entorno virtual (si existe)
# Windows:
.venv\Scripts\activate.bat
# Linux/Mac:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Crear o editar el archivo `backend/.env`:

```env
# Configuración de Tesseract
TESSERACT_CMD=tesseract
TESSDATA_PREFIX=

# Google Cloud Vision (opcional)
GOOGLE_APPLICATION_CREDENTIALS=./credentials/tu-archivo-credenciales.json

# OCR.space API (ya configurado)
OCRSPACE_API_KEY=K84507731988957

# Directorio temporal
TMP_DIR=./temp
```

### 3. Verificar Configuración

```bash
cd backend
python -c "from config import *; print('Configuración cargada correctamente')"
```

## 🌐 Configuración del Frontend

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crear el archivo `frontend/.env`:

```env
# URL del backend
VITE_API_BASE_URL=http://127.0.0.1:8000

# Puerto del servidor de desarrollo
VITE_DEV_SERVER_PORT=3000
```

### 3. Verificar Configuración

```bash
cd frontend
npm run build
```

## 🚀 Iniciar el Sistema

### Opción 1: Script Automático (Recomendado)

```bash
# Windows
start-all.bat

# Linux/Mac
./start-all.sh
```

### Opción 2: Inicio Manual

#### Terminal 1 - Backend:
```bash
cd backend
python run_backend.py
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🔍 Verificar la Conexión

### 1. Verificar Backend

Abre tu navegador y visita:
- **API Root**: http://127.0.0.1:8000/
- **Health Check**: http://127.0.0.1:8000/api/health
- **Documentación**: http://127.0.0.1:8000/docs

### 2. Verificar Frontend

Abre tu navegador y visita:
- **Aplicación**: http://localhost:3000

### 3. Script de Prueba Automática

```bash
python test_connection.py
```

## 📡 Endpoints de la API

### POST /api/convert
Convierte una imagen a documento.

**Parámetros:**
- `file`: Archivo de imagen (PNG, JPG, JPEG)
- `lang`: Idioma (ej: 'spa', 'eng')
- `output_format`: Formato de salida ('txt', 'docx', 'xlsx')

**Respuesta:**
```json
{
  "success": true,
  "filename": "uuid.docx",
  "content": "base64_encoded_content",
  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text_length": 1234,
  "language": "spa"
}
```

### GET /api/languages
Obtiene idiomas disponibles.

### GET /api/health
Verifica el estado del servidor.

## 🔒 Configuración CORS

El backend está configurado para permitir conexiones desde:
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:4173
- http://127.0.0.1:4173

## 🌐 Proxy del Frontend

El frontend usa un proxy configurado en `vite.config.js` que redirige todas las peticiones `/api/*` al backend en `http://127.0.0.1:8000`.

## 🐛 Solución de Problemas

### Error: "No se puede conectar al servidor"

1. Verifica que el backend esté ejecutándose en el puerto 8000
2. Verifica que no haya firewall bloqueando la conexión
3. Ejecuta `python test_connection.py` para diagnosticar

### Error: "CORS policy"

1. Verifica que el backend esté ejecutándose
2. Verifica la configuración CORS en `backend/app.py`
3. Asegúrate de que el frontend esté en uno de los orígenes permitidos

### Error: "OCR no funciona"

1. Verifica que Tesseract esté instalado: `tesseract --version`
2. Verifica las credenciales de Google Cloud Vision (si las usas)
3. Revisa los logs del backend para errores específicos

### Error: "Archivo no se descarga"

1. Verifica que el backend esté generando archivos correctamente
2. Revisa la consola del navegador para errores JavaScript
3. Verifica que el formato de salida sea válido

## 📊 Monitoreo y Logs

### Backend Logs
El backend registra todas las operaciones en la consola con timestamps.

### Frontend Logs
Abre la consola del navegador (F12) para ver logs del frontend.

### Health Check
Usa el endpoint `/api/health` para monitorear el estado del servidor.

## 🔄 Flujo de Trabajo Típico

1. **Usuario sube imagen** → Frontend valida archivo
2. **Frontend envía a backend** → POST /api/convert
3. **Backend procesa OCR** → Tesseract + Google Vision + OCR.space
4. **Backend genera documento** → TXT, DOCX o XLSX
5. **Backend devuelve base64** → Frontend recibe respuesta
6. **Frontend descarga archivo** → Usuario recibe documento

## 🎯 Próximos Pasos

- [ ] Configurar variables de entorno
- [ ] Iniciar backend y frontend
- [ ] Probar conexión con `test_connection.py`
- [ ] Subir una imagen de prueba
- [ ] Verificar descarga del documento

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del backend y frontend
2. Ejecuta `python test_connection.py`
3. Verifica la configuración de red y firewall
4. Consulta la documentación de FastAPI y Vite

---

**¡El sistema está listo para funcionar! 🎉**
