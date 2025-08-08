# backend/ocr_service/table_detection/detector.py

import re

def parse_text_as_table(text: str):
    """
    Intenta identificar filas y columnas de una tabla basada en texto plano.
    Utiliza separadores como '|', tabulaciones o múltiples espacios para segmentar celdas.
    """
    table = []
    rows = text.strip().split('\n')
    for row in rows:
        if '|' in row:
            cells = row.split('|')
        elif '\t' in row:
            cells = row.split('\t')
        elif re.search(r'  +', row):
            cells = re.split(r'  +', row)
        else:
            cells = [row]
        table.append([cell.strip() for cell in cells if cell.strip()])
    return table