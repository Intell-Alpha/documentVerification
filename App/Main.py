from DocumentVerificationOCR import DocumentReader

class App:
    def __init__(self, verifyCategory: list, ApplicantDocuments: list, VerificationDocuments: list) -> None:
        self.verifyCateogry = verifyCategory
        self.ApplicantDocuments = ApplicantDocuments
        self.verificationDocuments = VerificationDocuments
    
    def convertApplicantDocs_to_text(self):
        # Convert Applicant Documents to text using DocumentReader
        txt = []
        for i in self.ApplicantDocuments:
            doc = DocumentReader.Docverification(i)
            txt.append(doc.returnText())
        return txt

    def convertVerificationDocuments(self):
        txt = []
        for i in self.verificationDocuments:
            doc = DocumentReader.Docverification(i)
            txt.append(doc.returnText())
        return txt
    
    
