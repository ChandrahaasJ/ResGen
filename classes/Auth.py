from dotenv import load_dotenv
import os
from google import genai
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
class Auth:
    def __init__(self,path):
        load_dotenv(dotenv_path=path)
        self.__gemini = os.getenv("LLM")
        self.client = genai.Client(api_key=self.__gemini)

