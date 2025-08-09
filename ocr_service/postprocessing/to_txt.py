# backend/ocr_service/postprocessing/to_txt.py

from ..utils.file_utils import get_temp_path

def generate_txt(text: str, filename: str) -> str:
    path = get_temp_path(f"{filename}.txt")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    return path