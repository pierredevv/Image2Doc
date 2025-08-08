# backend/ocr_service/utils/language_utils.py

import subprocess, re
from config import TESSERACT_CMD
from .logger import logger

def get_available_languages():
    try:
        result = subprocess.run(
            [TESSERACT_CMD, '--list-langs'], capture_output=True, text=True, check=True
        )
        langs = result.stdout.splitlines()[1:]
        return [l.strip() for l in langs if l.strip()]
    except Exception as e:
        logger.error(f"Error obteniendo idiomas: {e}")
        return ['eng', 'spa']

def validate_language(lang):
    av = get_available_languages()
    requested = re.split(r'[+,\s]', lang)
    valid = [l for l in requested if l in av]
    return '+'.join(valid) if valid else 'spa'