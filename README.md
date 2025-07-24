Doctor Dashboard - Clinic Management System

🩺 Overview

The Doctor Dashboard is part of the Clinic Management System designed for streamlined communication and efficient management between doctors and receptionists. It includes functionalities like:

Role-based authentication (Doctor/Receptionist)

Token generation for patients

Patient record tracking and prescription entry

Real-time Firebase database synchronization

Billing and status management

📁 Project Structure

clinic-management-system/

├── public/

├── src/

│   ├── Components/

│   │   ├── DoctorDashboard.js

│   │   ├── ReceptionistDashboard.js

│   │   ├── LoginPage.js

│   │   └── ...

│   ├── firebase.js

│   ├── App.js

│   ├── App.css

│   └── index.js

├── README.md

├── package.json

└── .firebaserc

🚀 Workflow Explanation

1. Authentication

Role-based login via Firebase Auth.

Redirect based on role to respective dashboards.

2. Doctor Dashboard

Displays total patients, pending appointments.

Lists today's patients with editable status buttons.

Prescriptions are added in a modal and saved to Firebase.

3. Receptionist Dashboard

Adds new patients and generates token.

Displays patient data from Firebase in a table.

Separate page for billing: generates invoice, calculates GST, saves to database.

4. Firebase Sync

Realtime database fetches data on changes.

Uses onSnapshot/onValue listeners.

5. Logout

Secure logout using Firebase Auth's signOut().

🛠️ System Design (LLD)

Entities:

User (Doctor/Receptionist)

Patient

Token

Prescription

Billing

Key Functions:

addPatient() - Adds patient and generates token

updateStatus() - Changes appointment status

addPrescription() - Saves doctor's notes

generateInvoice() - Calculates total and tax

## Database (Firebase Realtime):

/roles/{uid} = doctor | receptionist
/patients/{id} = {name, dob, status, contact, token}
/prescriptions/{patientId} = {notes, timestamp}
/billing/{patientId} = {items, total, gst}


Architecture Diagram

Frontend (React) ➝ Firebase Authentication ➝ Firebase Realtime Database

User login triggers role-based routing.

Real-time updates sync data across dashboards.

(image.png)



## 💻 Run Locally

```bash
# Clone the project
git clone https://github.com/Tempest200/clinic-management-system.git
cd clinic-management-system

# Install dependencies
npm install

# Start development server
npm start
