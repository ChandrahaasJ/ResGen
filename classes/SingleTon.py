from Auth import Auth

class Singleton:
    def __init__(self,path):
        self.auth=Auth(path)
        self.client=self.auth.client