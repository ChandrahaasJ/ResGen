import os
#from classes.SingleTon import Factory
from classes.Auth import AuthCl
from resGen.classes.perception import Perception as p
envs=r"C:\ResumeGenerator\resGen\.env"

ITERATIONS=3

i=0
authOBJ=AuthCl(envs)
pOBJ=p(authOBJ)
print("[AGENT] Tell me about yourself?")
resp=str(input())
while(True):
    p1=pOBJ.get_Initialperception(response=resp)
    li=p1['missed']
    print(p1)
    
# reply="hi, i am chandrahaas jasti of KMIT, majoring in CSE. I have been dabbling in many technology stacks which include Java,Python and Javascript. I have worked with frameworks like flask,fastAPI,Django. and included websockets to decrease the latency.I am also the club hear of Riti-the upcycling club ok KMIT. Also a part of student council. I am also well versed in databases like SQL,MongoDB and Redis. Familiar with devOps tools like Docker and Kubernetes"
# p1=pOBJ.get_Initialperception(response=reply)
# print(p1)