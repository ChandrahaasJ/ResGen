from dotenv import load_dotenv
import os
from google import genai
from HR.perception import Perception
class Auth:
    def __init__(self,path):
        load_dotenv(dotenv_path=path)
        self.__gemini = os.getenv("LLM")
        self.client = genai.Client(api_key=self.__gemini)

authobj=Auth(r"C:\ResumeGenerator\resGen\.env")
perception = Perception(authobj)
res=perception.get_perception("I'm a confident and determined person who enjoys learning and trying new things. I'm creative and disciplined, and I always do my best in any work I take on. I’m friendly, reliable, and work well in a team. I also don’t mind stepping out of my usual role to help others or learn something new. Overall, I’m someone who takes my work seriously but also enjoys working with people and growing through new experiences.")
print(res)