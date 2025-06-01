import os
from dotenv import load_dotenv
from google import genai
load_dotenv(dotenv_path=r"C:\ResumeGenerator\resGen\.env")
gem=os.getenv("LLM")

gemini=os.getenv("LLM")
client = genai.Client(api_key=gemini)

with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\objective_prompt.txt","r") as f:
    objective_prompt = f.read()

ans="""
This is Pravalika and I am currently in my 3rd year of engineering in kmit. I’ve spent my college years learning new programming languages and experimenting with them through problem solving and projects. I have done 2 projects which come under generative ai domain. The first project’s chatbot for medical queries which focuses on giving day to day medical related information when asked by the user and to achieve that  my team and me have used an llm called Bert and rag for retrieval of the apt information. We have also used faiss that’s a Facebook ai similarly search it’s a library which helps mapping similar data together, by using both of them the retrieval process became accurate. The other project was called as FYI - for your information. This was a news generator which summarises different articles from different sources and gives you a better idea of the news topic, another feature was YouTube summarisation as well. These are the two projects I have done and I learnt a lot from these. I’ve learnt about llms, about front end, back end and all the different aspects of building a project. I am proficient in speaking skills and a good team spirit."""

objective_prompt+=ans
objective_prompt+="\n\n"
objective_prompt+=""" FINAL INSTRUCTION:
Be Sure to use the examples, guidelines and instructions provided in the prompt to generate the response in JSON format ONLY.\n\n"""

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=objective_prompt
)
print(response.text)