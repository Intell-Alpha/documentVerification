import cv2

img = cv2.imread(r'C:\Users\kaush\Documents\intelAlpha\documentVerification\sampleImages\sampledocument.jpeg')
width, height, _ = img.shape

image = img[550:][:]
# cv2.imwrite(r"C:\Users\kaush\Documents\intelAlpha\documentVerification\sampleImages\sampleCropPAss.jpg", image)
cv2.imshow("crop image: ", image)
cv2.waitKey(0)
cv2.destroyAllWindows()