# backend/ocr_service/postprocessing/text_correction.py

from spellchecker import SpellChecker
from textblob import TextBlob
from ..utils.logger import logger

def correct_text(text: str, lang: str = 'es') -> str:
    try:
        spell = SpellChecker(language='es' if lang.startswith('es') else 'en')
        words = text.split()
        corrected = []

        for word in words:
            if any(c.isdigit() for c in word) or not word.isalnum():
                corrected.append(word)
                continue
            if len(word) > 3 and word not in spell:
                suggestion = spell.correction(word)
                corrected.append(suggestion if suggestion else word)
            else:
                corrected.append(word)

        basic = ' '.join(corrected)
        try:
            return str(TextBlob(basic).correct())
        except:
            return basic

    except Exception as e:
        logger.error(f"Error corrigiendo texto: {e}")
        return text