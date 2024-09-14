"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold


class Gemini_Model:
    def __init__(self) -> None:
      genai.configure(api_key="AIzaSyDBNCN6BnCmRkTgDZU7xmxWxkX4hZNVG6Q")

      # Create the model
      self.generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
      }

    #   self.safetySettings = {
        # HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_UNSPECIFIED: HarmBlockThreshold.BLOCK_NONE
    # }

      self.model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=self.generation_config,
        # safety_settings = Adjust safety settings
        # See https://ai.google.dev/gemini-api/docs/safety-settings
      )

    def getValidation(self, category,application, verification):
      prompt = f'''

      you are my text validator to check whether all the information in application is present in verification text.
      The application text is: {application}
      The verification text is: {verification}
      verify the documents under the person's {category} category
      give the output in the below format:
      [score, comments]
      score represents the consistency score between 1-100
      comments represents the validation comments between 10-15 words

    '''
      prompt1 = f'check the consistency between application document [{application}] and verification document [{verification}] and return a consistency score (1-100) and give the summary of validation in less than 30 words'
      response = self.model.generate_content([prompt1], safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_UNSPECIFIED: HarmBlockThreshold.BLOCK_NONE
        
      })
      # print(response)
      return response.text


# # Upload the file and print a confirmation.
# sample_file = genai.upload_file(path=r"sampleImages\samplepassfront.jpg",
#                             display_name="simple text")

# print(f"Uploaded file '{sample_file.display_name}' as: {sample_file.uri}")

# # file = genai.get_file(name=sample_file.name)
# # print(f"Retrieved file '{file.display_name}' as: {sample_file.uri}")

