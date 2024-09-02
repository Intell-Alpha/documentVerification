import cv2
import pytesseract
from pytesseract import Output

class Docverification:
    def __init__(self, image_path):
        self.image_path = image_path
    def returnText(self):
        img = cv2.imread(self.image_path)
        txt = pytesseract.image_to_string(img)
        return txt
    

