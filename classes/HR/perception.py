class Perception:
    def __init__(self,auth):
        with open(r"C:\ResumeGenerator\resGen\classes\HR\prompts\objective_prompt.txt", "r") as f:
            self.initial_prompt=f.read()
        self.auth=auth


    def get_perception(self, response):
        client=self.auth.client
        prompt = self.initial_prompt + response + "\n\nFINAL INSTRUCTION:\nBe sure to use the examples, guidelines, and instructions provided in the prompt to generate the response in JSON format ONLY.\n\n"
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return response.text
    