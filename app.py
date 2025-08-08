# API Flask

from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from ocr_service.ocr_engine.ocr_hybrid import hybrid_ocr
from ocr_service.postprocessing.text_correction import correct_text
from ocr_service.postprocessing.to_txt import generate_txt
from ocr_service.postprocessing.to_docx import generate_docx
from ocr_service.postprocessing.to_xlsx import generate_xlsx
from ocr_service.utils.file_utils import save_upload_file, clear_temp_files
import uuid

app = FastAPI()

@app.post("/convert")
async def convert_image(
    file: UploadFile,
    lang: str = Form("es"),
    output_format: str = Form("txt")
):
    try:
        temp_path = await save_upload_file(file)
        raw_text = hybrid_ocr(temp_path, lang=lang)
        corrected_text = correct_text(raw_text, lang=lang)
        filename = str(uuid.uuid4())

        if output_format == "txt":
            output_path = generate_txt(corrected_text, filename)
        elif output_format == "docx":
            output_path = generate_docx(corrected_text, filename)
        elif output_format == "xlsx":
            output_path = generate_xlsx(corrected_text, filename)
        else:
            return JSONResponse(status_code=400, content={"error": "Formato no soportado."})

        return FileResponse(output_path, filename=f"{filename}.{output_format}", media_type="application/octet-stream")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        clear_temp_files()

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de OCR. Usa el endpoint /convert para procesar imágenes."}
