# backend/config.py

import os

# Ruta al ejecutable Tesseract
TESSERACT_CMD = os.getenv('TESSERACT_CMD', r'C:\Program Files\Tesseract-OCR\tesseract.exe')
# Ubicación de los datos de Tesseract (tessdata)
TESSDATA_PREFIX = os.getenv('TESSDATA_PREFIX', os.path.dirname(TESSERACT_CMD))
# Google Cloud credentials
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'path/to/credentials.json')
# OCR.space API key
OCRSPACE_API_KEY = os.getenv('OCRSPACE_API_KEY', 'helloworld')
# Directorio temporal
TMP_DIR = os.getenv('TMP_DIR', None)