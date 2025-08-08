# backend/ocr_service/ocr_engine/ocrspace.py

import requests
from io import BytesIO
from config import OCRSPACE_API_KEY
from PIL import Image
from ..utils.logger import logger

def ocr_ocrspace(image_path: str) -> str:
    try:
        image = Image.open(image_path)
        buf = BytesIO()
        image.save(buf, format='JPEG')
        res = requests.post(
            'https://api.ocr.space/parse/image',
            files={'image': ('image.jpg', buf.getvalue())},
            data={'apikey': OCRSPACE_API_KEY, 'language':'spa'}
        )
        result = res.json()
        if result.get('ParsedResults'):
            return result['ParsedResults'][0]['ParsedText']
        return ''
    except Exception as e:
        logger.error(f"OCR.space error: {e}")
        return ''