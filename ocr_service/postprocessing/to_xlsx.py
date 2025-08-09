# backend/ocr_service/postprocessing/to_xlsx.py

from openpyxl import Workbook
from ..utils.file_utils import get_temp_path
from ..table_detection.detector import parse_text_as_table

def generate_xlsx(text: str, filename: str) -> str:
    path = get_temp_path(f"{filename}.xlsx")
    wb = Workbook()
    ws = wb.active

    table = parse_text_as_table(text)
    for row_idx, row in enumerate(table, 1):
        for col_idx, cell in enumerate(row, 1):
            ws.cell(row=row_idx, column=col_idx, value=cell)

    wb.save(path)
    return path