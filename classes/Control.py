import json
class controller:
    def __init__(self):
        self.section_start=r"\begin{{rSection}}{{{}}}"
        self.section_end = r"\end{rSection}"
        self.begin="k"

    def get_begin(self,personal_infos):
        github=personal_infos["github"]
        linkedin=personal_infos["linkedin"]
        email=personal_infos["email"]
        phone=personal_infos["phone"]
        


    def build_projects(self,pjson,text):
        """
        Builds the projects from the provided JSON data.
        
        :param projects_json: JSON data containing project information.
        :return: latex
        """
        projects = json.loads(pjson)
        text+=self.begin_section("Projects")
        text+="\n"
        for i in range(len(projects)):
            pj=projects[str(i)]
            project_title = pj["name"]
            project_description = pj["description"]
            text+=rf"""\item \textbf{{{project_title}}}\\"""
            #text+="\n"
            text+=f"{project_description}\n"
            print("=============================================")
        #text+="\n"
        text+=self.end_section()
        return text

    def begin_section(self, section_name):
        """
        Begins a new section in the LaTeX document.
        
        :param section_name: Name of the section to begin.
        :return: LaTeX formatted string for the section start.
        """
        return self.section_start.format(section_name)
    def end_section(self):
        """
        Ends the current section in the LaTeX document.
        
        :return: LaTeX formatted string for the section end.
        """
        return self.section_end
    


obj=controller()
dict={"0":{"name":"Ransomware Detection and Prevention","description":"Designed a 3-tier architecture for real-time ransomware detection using Layer 7 SMB protocol analysis. Developed a custom tokenizer to convert network packets into 28×28×1 images for CNN-LSTM classification. Used WebSockets and Redis for communication and caching. Deployed on Kubernetes."},"1":{"name":"deepfake","description":"detect morphs"}}
json_data=json.dumps(dict)

text=r""" 
\documentclass{resume} % Custom resume.cls

\usepackage[left=0.4in, top=0.4in, right=0.4in, bottom=0.4in]{geometry}
\usepackage{hyperref}
\name{Chandrahaas Jasti}
\address{+91 7981807540 \\ Hyderabad, India}
\address{\href{mailto:chandrahaasjasti@gmail.com}{chandrahaasjasti@gmail.com} \\ \href{https://linkedin.com/in/chandrahaas-jasti-87b697288}{in/chandrahaas-jasti-87b697288} \\ \href{https://github.com/ChandrahaasJ}{github.com/ChandrahaasJ}}

\begin{document}

%-------------------------------------
\begin{rSection}{Objective}
As a Computer Science major, I’ve consistently explored technologies that sparked my curiosity. Along the way, I’ve faced my fair share of roadblocks, but I’ve always thrived on the adrenaline rush that comes from overcoming them. I’m driven by a love for learning and a desire to look back each day and realize I can now do something I couldn’t do yesterday.
\end{rSection}

%-------------------------------------
\begin{rSection}{Education}
{\bf Computer Science Engineering}, KMIT \hfill Expected 2026 \\
Relevant Coursework: Operating Systems, DBMS, Computer Networks, Web-Technologies, Cloud Computing, Generative AI
\end{rSection}

%-------------------------------------
\begin{rSection}{Skills}
\begin{tabular}{ @{} >{\bfseries}l @{\hspace{4ex}} l }
Technical Skills: & Python, MCP, Computer Vision, WebSockets, Agents, Prompt Engineering \\
Libraries: & Flask, FastAPI, PyTorch, OpenCV \\
Tools: & Docker, AWS, Kubernetes \\
Databases: & SQL, MongoDB, Redis \\
\end{tabular}
\end{rSection}

%-------------------------------------
"""


# for i in range(len(dict)):
#     print("=============================================")
#     print(dict[str(i)])
obj.build_projects(json_data,text)
