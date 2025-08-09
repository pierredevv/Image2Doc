# backend/ocr_service/utils/file_utils.py

import os, tempfile
from fastapi import UploadFile
from config import TMP_DIR

# Carpeta para subir y almacenar temporales
UPLOAD_DIR = TMP_DIR or tempfile.gettempdir()

def get_temp_path(filename: str) -> str:
    return os.path.join(UPLOAD_DIR, filename)

async def save_upload_file(upload_file: UploadFile) -> str:
    """
    Guarda el archivo subido en disco y retorna la ruta.
    """
    ext = os.path.splitext(upload_file.filename)[1]
    unique = f"{upload_file.filename}"  # puedes usar uuid aquí
    dest = get_temp_path(unique)
    with open(dest, 'wb') as f:
        content = await upload_file.read()
        f.write(content)
    return dest


def clear_temp_files():
    """
    (Opcional) Limpia temporales en UPLOAD_DIR.
    Implementa según tu política de retención.
    """
    # Ejemplo simple: no hace nada
    pass