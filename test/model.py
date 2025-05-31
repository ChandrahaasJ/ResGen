from google import genai
from dotenv import load_dotenv
import os
load_dotenv(dotenv_path=r"C:\ResumeGenerator\resGen\.env")

gemini=os.getenv("LLM")
client = genai.Client(api_key=gemini)

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works in a few words"
)
print(response.text)