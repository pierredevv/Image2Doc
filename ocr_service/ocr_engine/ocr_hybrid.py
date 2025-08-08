# backend/ocr_service/ocr_engine/ocr_hybrid.py

from PIL import Image
from .tesseract import ocr_tesseract
from .google_vision import ocr_google_vision
from .ocrspace import ocr_ocrspace
from ..preprocessor.image_preprocessing import enhanced_preprocessing
from ..utils.logger import logger

def hybrid_ocr(image_path: str, lang: str = 'spa') -> str:
    try:
        img = Image.open(image_path)
    except Exception as e:
        logger.error(f"Error loading image: {e}")
        raise

    processed = enhanced_preprocessing(img)
    processed_path = image_path  # puedes guardar si lo deseas

    texts = []
    # Tesseract
    try:
        t = ocr_tesseract(processed, lang)
        texts.append(t)
    except Exception as e:
        logger.error(f"Tesseract error: {e}")

    # Google Vision
    try:
        g = ocr_google_vision(image_path)
        texts.append(g)
    except Exception as e:
        logger.error(f"Google Vision error: {e}")

    # OCR.space
    try:
        o = ocr_ocrspace(image_path)
        texts.append(o)
    except Exception as e:
        logger.error(f"OCR.space error: {e}")

    combined = "\n\n---\n\n".join([txt for txt in texts if txt])
    return combined
