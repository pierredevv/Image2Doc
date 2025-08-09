# backend/ocr_service/postprocessing/to_docx.py
from docx import Document
from ..utils.file_utils import get_temp_path

def generate_docx(text: str, filename: str) -> str:
    path = get_temp_path(f"{filename}.docx")
    doc = Document()
    for paragraph in text.split('\n\n'):
        doc.add_paragraph(paragraph.strip())
    doc.save(path)
    return path