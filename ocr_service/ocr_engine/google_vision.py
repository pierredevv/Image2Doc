# backend/ocr_service/ocr_engine/google_vision.py

from google.cloud import vision
from io import BytesIO
from config import GOOGLE_APPLICATION_CREDENTIALS
from PIL import Image
import os
from ..utils.logger import logger

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

client = vision.ImageAnnotatorClient()

def ocr_google_vision(image_path: str) -> str:
    try:
        # ✅ Abrir la imagen con PIL
        image = Image.open(image_path)
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Convertir a bytes
        buf = BytesIO()
        image.save(buf, format='JPEG')
        content = buf.getvalue()

        # Enviar a Google Vision
        resp = client.text_detection(image=vision.Image(content=content))

        # Devolver resultado
        return resp.text_annotations[0].description if resp.text_annotations else ''
    except Exception as e:
        logger.error(f"Google Vision OCR error: {e}")
        return ''