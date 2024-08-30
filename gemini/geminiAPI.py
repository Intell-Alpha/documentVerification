"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
import google.generativeai as genai

genai.configure(api_key="AIzaSyDBNCN6BnCmRkTgDZU7xmxWxkX4hZNVG6Q")

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

# Upload the file and print a confirmation.
sample_file = genai.upload_file(path=r"C:\Users\kaush\Documents\intelAlpha\documentVerification\sampleImages\sampledocument.jpeg",
                            display_name="simple text")

print(f"Uploaded file '{sample_file.display_name}' as: {sample_file.uri}")

# file = genai.get_file(name=sample_file.name)
# print(f"Retrieved file '{file.display_name}' as: {sample_file.uri}")

prompt = '''
fetch the following values from the given image

name:
card no:
sex:
age:

'''

response = model.generate_content([sample_file, prompt])

print(response)
