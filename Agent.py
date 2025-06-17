import os
import sys
import json
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#from classes.SingleTon import Factory
from classes.Auth import Auth
from resGen.classes.perception import Perception as p
envs=r"C:\ResumeGenerator\resGen\.env"

ITERATIONS=3

log={}
i=0
authOBJ=Auth(envs)
pOBJ=p(authOBJ)
print("[AGENT] Tell me about yourself?")
resp=str(input())
log['iteration-0']=resp
ans=pOBJ.get_Initialperception(response=resp)
i=1
print("=============== INITIAL SCHEMA =============")
print(ans)
while(True):
    print(f"======== ITERATION-{i} ===========")
    if(len(ans['missed'])==0):
        log[f'iteration-{i}']=ans
        print("Great, I have noted down everything. Have a great day")
        break
    else:
        log[f'iteration-{i}']=ans
        li=ans['missed']
        reply=input(" explain the following "+str(li))
        # Create a copy of the schema without the 'missed' field
        current_schema = ans.copy()
        del current_schema['missed']
        print("\nPrevious schema before update:")
        print(current_schema)
        # Pass the copy to extract_perception
        updated_schema = pOBJ.extract_perception(reply, current_schema)
        print("\nUpdated schema after perception:")
        print(updated_schema)
        ans = updated_schema
        i+=1

print("=============== FINAL ==============")
print(ans)

with open(r"C:\ResumeGenerator\resGen\classes\HR\log\log2.json",'w') as f:
    json.dump(log, f, indent=2)
