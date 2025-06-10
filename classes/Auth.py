from dotenv import load_dotenv
import os
from google import genai

class Auth:
    def __init__(self,path):
        load_dotenv(dotenv_path=path)
        self.__gemini = os.getenv("LLM")
        self.client = genai.Client(api_key=self.__gemini)

