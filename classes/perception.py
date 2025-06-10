from Auth import Auth
class Perception:
    def __init__(self,auth):
        with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\finalprompt.md", "r",encoding="utf-8") as f:
            self.initial_prompt=f.read()
        self.auth=auth
        with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\missed_prompt.txt","r",encoding="utf-8") as f:
            self.missed_prompt=f.read()


    def get_Initialperception(self, response):
        client=self.auth.client
        prompt = self.initial_prompt + response #+ "\n\nFINAL INSTRUCTION:\nBe sure to use the examples, guidelines, and instructions provided in the prompt to generate the response in JSON format ONLY.\n\n"
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        ans=self.strip(response.text)
        return eval(ans)
    
    def strip(self, resp):
        # Remove triple backticks and "json" (case-insensitive) from the start and end
        resp = resp.strip()
        if resp.startswith("```"):
            resp = resp.lstrip("`").lstrip().removeprefix("json").lstrip()
        if resp.endswith("```"):
            resp = resp.rstrip("`").rstrip()
        return resp
    
    def compute_missed(self,resp_json):
        l=[]
        for i in resp_json:
            if(len(resp_json[i])==0):
                l.append(i)
        resp_json['missed']=l
        return resp_json
    
    def extract_perception(self,response):
        prompt=self.missed_prompt + response
        client=self.auth.client 
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return response.text

    def find_empty_values(self, json_obj):
        l=[]
        self.empty_adder(json_obj,l)
        return l
    
    def empty_adder(self,json_obj,l):
        for i in json_obj:
            if(json_obj[i]==[] or json_obj[i]=={} or json_obj[i]=='' or json_obj[i]==None):
                l.append(i)
            else:
                if(isinstance(json_obj[i],dict)):
                    self.empty_adder(json_obj[i],l)
        return l
    

# jsonnn={
#         "name": "Pravalika",
#         "phone_number": "",
#         "email": "",
#         "current_work": {
#             "Student": ["3rd year", "kmit", "Engineering"]
#         },
#         "experience": {},
#         "skills": {
#             "Programming Languages": [],
#             "Generative AI": ["LLMs"],
#             "Project Development": ["Front end", "Back end"],
#             "Soft Skills": ["Speaking", "Team spirit"]
#         },
#         "acheivements": [],
#         "interests": [],
#         "ambiguous": []
#     }

obj=Perception(Auth(r"C:\ResumeGenerator\resGen\.env"))
text=""" I'm Arjun and I'm currently in my third year at KMIT. I interned at a company called Celume Studios.
"""
ns=obj.get_Initialperception(text)
print(ns)
print("=====================================================")
l=obj.find_empty_values(ns)
print(l)
