from Auth import Auth
from HR.perception import Perception

class Factory:
    def __init__(self,path):
        self.auth=Auth(path)
        self.client=self.auth.client
    
    # def run(self):
    #     perception = Perception(self.auth)
    #     return perception.get_Initialperception("Good Morning, I am Sri Vijju, a second year student from the Computer Science and machine learning branch.I'm the kind of person who enjoys trying new things, learning new things, and experimenting. I like to watch sitcoms and read books in my spare time.One thing I am sure about myself is that I adapt quickly to things and do not step back if I get something into myself. And I make a note to myself that deadlines should never be missed. I am passionate about what i do and strong enough to make decisions even when they are tough.")

