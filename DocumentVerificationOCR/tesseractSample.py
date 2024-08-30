import cv2
import pytesseract
from pytesseract import Output

# Load image
image = cv2.imread(r'C:\Users\kaush\Documents\intelAlpha\documentVerification\sampleImages\sampledocument.jpeg')

print(pytesseract.get_languages(config=''))

# Step 5: Apply OCR
# custom_config = r'-l hin+eng'
text = pytesseract.image_to_string(image)

# Optional: Post-processing
# Here you could apply regex, spell checking, or other corrections

print(text)
