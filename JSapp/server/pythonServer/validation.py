from flask import Flask, request, jsonify, Blueprint
import DocumentReader
import geminiAPI
import requests
from PIL import Image
import io
import re
from flask_cors import CORS


validation_bp = Blueprint('validation', __name__)
# CORS(app)
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
                category_verification_text += txt + " \n"

            AIvalidator = geminiAPI.Gemini_Model()
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

    @staticmethod
    def read_image_from_url(url):
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the request failed
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes)
        return image

# Flask route for document validation
@validation_bp.route('/validate-documents', methods=['POST'])
def validate_documents():
    try:
        # Get JSON data from the request
        input_data = request.get_json()
        category = input_data['list1']
        applicationDocuments = input_data['list2']
        verificationDocuments = input_data['list3']

        # Call the runMain function to get validation results
        params = App.runMain(category=category, application=applicationDocuments, verification=verificationDocuments)

        # Return the response as JSON
        return jsonify(params)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
