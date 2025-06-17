from resGen.classes.Auth import Auth
class Perception:
    def __init__(self,auth):
        with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\finalprompt.md", "r",encoding="utf-8") as f:
            self.initial_prompt=f.read()
        self.auth=auth
        with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\loop2_prompt.md","r",encoding="utf-8") as f:
            self.missed_prompt=f.read()


    def get_Initialperception(self, response):
        client=self.auth.client
        prompt = self.initial_prompt + response #+ "\n\nFINAL INSTRUCTION:\nBe sure to use the examples, guidelines, and instructions provided in the prompt to generate the response in JSON format ONLY.\n\n"
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        ans=self.strip(response.text)
        ans=eval(ans)
        l=self.find_empty_values(ans)
        ans['missed']=l
        return ans
    
    def strip(self, resp):
        # Remove triple backticks and "json" (case-insensitive) from the start and end
        resp = resp.strip()
        if resp.startswith("```"):
            resp = resp.lstrip("`").lstrip().removeprefix("json").lstrip()
        if resp.endswith("```"):
            resp = resp.rstrip("`").rstrip()
        return resp
    
    
    def extract_perception(self,response,schema):
        print("\nExtracting perception with schema:")
        print(schema)
        self.missed_prompt=self.missed_prompt.replace("{context}",str(schema))
        prompt=self.missed_prompt.replace("{latest_response}",str(response))
        client=self.auth.client 
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        ans=self.strip(response.text)
        ans=eval(ans)
        l=self.find_empty_values(ans)
        ans['missed']=l
        return ans

    def find_empty_values(self, json_obj):
        l=[]
        self.empty_adder(json_obj,l,"")
        return l
    
    def empty_adder(self,json_obj,l,path):
        for i in json_obj:
            current_path = f"{path}.{i}" if path else i
            if(json_obj[i]==[] or json_obj[i]=={} or json_obj[i]=='' or json_obj[i]==None):
                l.append(current_path)
            else:
                if(isinstance(json_obj[i],dict)):
                    self.empty_adder(json_obj[i],l,current_path)
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

