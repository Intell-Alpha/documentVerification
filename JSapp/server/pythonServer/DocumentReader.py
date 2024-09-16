import cv2
import pytesseract
from pytesseract import Output

class Docverification:
    def __init__(self, image):
        self.image = image
    def returnText(self):
        # img = cv2.imread(self.image_path)
        txt = pytesseract.image_to_string(self.image)
        # print(txt)
        return txt

# dd = Docverification(r'C:\Users\kaush\Documents\intelAlpha\documentVerification\sampleImages\LicenseKaushal.png')
# print(dd.returnText())