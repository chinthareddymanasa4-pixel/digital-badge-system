"Digital Badge and Certificate Verification System"
Project Overview:
This project is a full-stack web application designed to create, issue, and verify digital certificates and badges. The system allows administrators to manage certificate templates, issue credentials to recipients, generate QR codes, and verify credentials through a verification interface.
The application provides a secure credential management platform with authentication, credential tracking, and verification logging.
Key Features:
Admin Dashboard
Secure admin authentication
Dashboard overview
Manage certificate and badge templates
Credential Management
Issue certificates and badges
Manage recipients
Generate PDF credentials
Verification System
QR code generation
Credential verification
Verification logs
Tracking and Logs
Issued credentials history
Verification tracking
Credential management
System Architecture
Frontend:
React.js
Backend
FastAPI
Database
MongoDB
Authentication
JWT-based authentication
Credential Generation
PDF certificates with QR code verification
Tech Stack
Frontend
React
CSS
Axios
Backend:
FastAPI
Python
Database:
MongoDB
Other Libraries:
bcrypt
JWT authentication
QR code generation
ReportLab (PDF generation)
Project Structure
Verify-Digital-Badges-and-Certificates
│
├── backend
│   ├── server.py
│   ├── requirements.txt
│   ├── uploads
│   ├── memory
│   └── tests
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── components
│
└── README.md
Installation Guide
1 Clone the repository
git clone https://github.com/BSVGK1919/Verify-Digital-Badges-and-Certificates.git
cd Verify-Digital-Badges-and-Certificates
Backend Setup
Navigate to backend directory
cd backend
Create virtual environment
python3 -m venv venv
source venv/bin/activate
Install dependencies
pip install -r requirements.txt
Start backend server
uvicorn server:app --reload --port 8001
Backend runs at
http://localhost:8001
Frontend Setup
Navigate to frontend folder
cd frontend
Install dependencies
npm install
Run frontend
npm start
Frontend runs at
http://localhost:3000
Environment Configuration
Backend .env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
JWT_SECRET=your-secret-key

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
Frontend .env
REACT_APP_BACKEND_URL=http://localhost:8001
Default Admin Login
Email: admin@example.com
Password: admin123
Example Workflow
1 Admin logs into dashboard
2 Create certificate template
3 Add recipients
4 Issue credential
5 System generates QR code and PDF
6 Credential can be verified using QR code or verification system
Security Features
JWT authentication
Password hashing using bcrypt
Secure credential verification
Admin role-based access
Future Improvements
Blockchain credential verification
Email credential delivery
Public verification portal
Credential analytics dashboard