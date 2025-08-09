# backend/ocr_service/ocr_engine/tesseract.py

from PIL import Image
import pytesseract
from config import TESSERACT_CMD
from ..utils.logger import logger

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

def ocr_tesseract(image: Image.Image, lang: str) -> str:
    try:
        config = '--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, lang=lang, config=config)
        return text
    except Exception as e:
        logger.error(f"Tesseract OCR error: {e}")
        return ''