import DocumentReader
import geminiAPI
import requests
from PIL import Image
import io
import re
import sys
import json
class App:
    def __init__(self, categories: list, ApplicantDocuments: list, VerificationDocuments: list) -> None:
        self.Categories = categories
        self.ApplicantDocuments = ApplicantDocuments
        self.verificationDocuments = VerificationDocuments
        self.validation = []
    
    def extract_numbers_from_multiline_string(self, s):
        numbers = re.findall(r'\d+', s)
        return [int(number) for number in numbers]

    
    def generateScore(self):
        
        for category in self.Categories:
            category_applicant_text = ""
            category_verification_text = ""
            for application in self.ApplicantDocuments:
                
                img = App.read_image_from_url(application)
                docRead = DocumentReader.Docverification(img)
                txt = docRead.returnText()
                category_applicant_text += txt + " \n"
                
            for verification in self.verificationDocuments:
                
                img = App.read_image_from_url(verification)
                docRead = DocumentReader.Docverification(img)
                txt = docRead.returnText()
                # print(txt)
                category_verification_text += txt + " \n"

            AIvalidator = geminiAPI.Gemini_Model()
            # print(category)
            # print(category_applicant_text)
            # print(category_verification_text)
            score = AIvalidator.getValidation(category, category_applicant_text, category_verification_text)
            self.validation.append(score)
        return self.validation

    def runMain(category, application, verification):
        app = App(category, application, verification)
        val = app.generateScore()
        scores = []
        finalTxt = ""
        for i in val:
            scores.append(app.extract_numbers_from_multiline_string(i))
            finalTxt += i + "\n"
        return [scores[0][0], finalTxt]

    def read_image_from_url(url):
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the request failed
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes)
        return image



# cat = ['identity']

# applicationDocuments = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2Fedu2.png?alt=media&token=e4c632a5-3df3-408a-969c-bb272aa0428d', 'https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FkaushalIdentity.png?alt=media&token=161c8e21-eaf5-4d8b-a321-01573f98762d']
# verificationDocuments = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2Frandome1?alt=media&token=341a8ebd-037c-48d3-8ccf-67839fe883ea', 'https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FWhatsApp%20Image%202024-09-05%20at%2011.31.59%20AM.jpeg?alt=media&token=377fd08e-f96e-4997-b83c-3254bef8da08']

# params = App.runMain(category=cat, application=applicationDocuments, verification=verificationDocuments)
# print(params[0])
# print(params[1])

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    category = input_data['list1']
    applicationDocuments = input_data['list2']
    verificationDocuments = input_data['list3']
    params = App.runMain(category=category, application=applicationDocuments, verification=verificationDocuments)
    print(json.dumps(params))