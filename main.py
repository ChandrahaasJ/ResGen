from classes.Rag import EmbRag
def main():
    print("Hello from resgen!")
    doc=r"C:\ResumeGenerator\resGen\docs"
    faiss=r"C:\ResumeGenerator\resGen\faiss"
    obj=EmbRag(doc,faiss)
    res=obj.queryDB("Is chandrahaas experienced in Kubernetes?")
    print(res)

if __name__ == "__main__":
    main()
