# test_tesseract.py
from PIL import Image
import pytesseract

# Si no añadiste al PATH, descomenta y ajusta:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

img = Image.open('C:\\Users\\PIETRO\\Downloads\\test.png')
print(pytesseract.image_to_string(img))