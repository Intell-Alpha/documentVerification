PRAVAH - Platform for Reliable Authentication and Verification of Accredited Holdings

PRAVAH is a comprehensive automated document verification platform designed to eliminate inefficiencies in manual document verification processes. The platform leverages Artificial Intelligence (AI), Blockchain technology, and Optical Character Recognition (OCR) to ensure secure, tamper-proof, and efficient verification of documents such as academic transcripts, certificates, and identity documents.

Key Features
- AI-Powered Verification: Automatically verifies document authenticity using advanced AI models.
- OCR Integration: Extracts text from uploaded document images for validation against blockchain hashes.
- Blockchain-Backed: Ensures tamper-proof, immutable records for secure document verification.
- User-Friendly Interface: A simple, intuitive interface for issuing authorities, verifying authorities, and individuals.
- Encryption: Uses XSalsa20 encryption to secure document uploads and storage.
- Real-Time Verification: Provides instant feedback on document authenticity.
- Audit Trails: Maintains logs of all verification activities for transparency and accountability.
- Scalable Architecture: Cloud-based infrastructure (Firebase) to handle high volumes of documents efficiently.

System Modules
1. Issuing Authority Dashboard
- Secure upload of digital documents.
- Encryption and secure storage using XSalsa20 encryption.

2. User Dashboard
- View and manage personal documents securely.
- Access a portal to track the status of document verifications.

3. Verifying Authority Dashboard
- Verify documents by comparing blockchain hashes with extracted OCR data.
- Real-time document validation powered by AI-driven analysis.

Project Structure
- App/: Contains the core application code and dashboard interfaces.
- DocumentVerificationOCR/: Module for document text extraction and verification using OCR.
- Blueprints/: Architectural blueprints for system flow and process design.
- ProjectChecklist/: A list of tasks and milestones for project development.
- Roadmaps/: Detailed project roadmap for upcoming features and improvements.
- SampleImages/: Example documents used for testing OCR and verification.
- LICENSE: MIT License for the project.
- README.md: Project overview and documentation.
- Task.doc: Documentation of ongoing and completed tasks for project tracking.

Technology Stack
- Frontend: ReactJS (or Angular) for responsive, intuitive user interfaces.
- Backend: Python-based server for handling API requests and AI model integration.
- AI Models: Multimodal models for document verification and NLP-based text analysis.
- OCR: Integration with Tesseract or a custom OCR model for text extraction.
- Blockchain: Hyperledger or Ethereum smart contracts for securely storing document hashes.
- Cloud: Firebase for cloud storage, scalability, and real-time data management.
- Encryption: XSalsa20 encryption to secure document uploads and storage.

Getting Started
Prerequisites
- Node.js
- npm
- Python 3.x

Clone the Repository
git clone https://github.com/Intell-Alpha/documentVerification.git

Install Dependencies
npm install

Start the Development Server
npm start

Firebase and Blockchain Setup
Follow the setup instructions in roadmaps/ to configure Firebase and the blockchain environment.

Contributors
- Kaushal Sambanna
- Makam Devansh
- Srilekha Kasha
- Srivarsha Chivukula
- Pervez Mubeen 
- Sriram Shiva Keshav

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Future Enhancements
- Expand integration to support additional document types.
- Implement machine learning-based anomaly detection for identifying fraudulent documents.
- Add support for a mobile app for issuing, viewing, and verifying documents.
