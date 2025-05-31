import os
from dotenv import load_dotenv
from google import genai
load_dotenv(dotenv_path=r"C:\ResumeGenerator\resGen\.env")
gem=os.getenv("LLM")

gemini=os.getenv("LLM")
client = genai.Client(api_key=gemini)

prompt=""" 
you are a Human Resources professional with expertise in employee perception.
you asked a candidate who appeared a question which goes as: "Tell me about yourself"
your job is to identify his expertise and skills in different fields.
derive occupation(the candidate can also be a student), skills(e.g. programming languages,soft skills, sports) and experience(only coorporate expereince).

GUIDELINES:
1. If the candidate did not mention any occupation, skills or experience, ask him again what he again what he missed
"""

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works in a few words"
)
print(response.text)