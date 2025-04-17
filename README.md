# Hospital Management System (HMS)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## NB
This project is functional but not officially complete. Just a heads up!
## Overview

This Hospital Management System (HMS) is a comprehensive software solution designed to streamline and automate various administrative, financial, and clinical processes within a hospital. Built from scratch for the StackUp Coding Challenge, this HMS aims to improve efficiency, reduce errors, and enhance the overall patient experience.

## 📽 Video Demo

- [Watch the demo (GitHub)](./Demo.mp4)  
- [Watch the demo (YouTube)](https://youtu.be/4-54sQvv3c0)

 

## AI Integrations

This HMS incorporates AI to enhance efficiency and decision-making:

*   **AI-Powered Shift Scheduling:**
    *   Uses Google gemini-1.5-flash to automate staff shift assignments.
    *   Takes into account factors like staff availability, workload balance, and department requirements.
    *   Reduces manual effort and ensures optimal staff coverage.
    *   File: backend/services/shiftService.js

*   **AI-Driven Medical Record Analysis:**
    *   Leverages Google gemini-1.5-flash to generate concise summaries of patient medical history.
    *   Identifies potential risk factors, treatment optimization opportunities, and areas requiring further investigation.
    *   Helps doctors make more informed decisions and improve patient care.
    *   File:  backend/services/medicalRecordService.js




## Key Features

*   **Patient Management:**
    *   Register new patients with detailed information (name, contact details, demographics, etc.).
    *   Maintain patient records with medical history, allergies, and other relevant data.
    *   Search and filter patients based on various criteria.
*   **Staff Scheduling:**
    *   Create and manage staff schedules, taking into account roles, departments, and availability.
    *   Automated shift assignment with AI assistance (see below).
    *   Generate reports on staff workload and schedule coverage.
*   **Medical Record Keeping:**
    *   Create, update, and view patient medical records.
    *   Track diagnoses, treatments, medications, and symptoms.
    *   AI-powered medical record summary generation (see below).
*   **Appointment Scheduling:**
    *   Schedule and manage patient appointments with doctors.
    *   View appointments by doctor, patient, or date.
    *   Send automated appointment reminders to patients.
*   **Billing and Financial Management:**
    *   [Describe your billing features here.  At a minimum, mention the ability to generate invoices and track payments.]
*   **Role-Based Access Control (RBAC):**
    *   Different user roles (Super Admin, Admin, Doctor, Nurse, Receptionist, Patient) with specific permissions.
    *   Ensures data security and appropriate access levels for each user.
*   **Real-time Notifications:**
    *   WebSockets integration for real-time updates on new tasks, appointments, and other important events.
*   **Audit Logging**
    *   Track all changes to records and access in the system.





## Technologies Used

*   **Frontend:** React, TypeScript, Redux Toolkit (RTK Query), Ant Design
*   **Backend:** Node.js, Express, MongoDB, Mongoose
*   **Authentication:** JWT (JSON Web Tokens), bcryptjs
*   **Real-time Communication:** Socket.IO
*   **AI:** [Specify AI libraries/APIs used, e.g., Google Gemini/Vertex AI, OpenAI]
*   **Validation:** express-validator
*   **Logging:** Winston

## Why These Technologies?

*   **React and TypeScript:** React provides a component-based architecture for building a user-friendly and interactive interface, while TypeScript adds type safety and improves code maintainability.
*   **Node.js and Express:** Node.js allows for efficient and scalable server-side development using JavaScript, and Express simplifies the creation of RESTful APIs.
*   **MongoDB and Mongoose:** MongoDB is a NoSQL database that is well-suited for storing unstructured data, such as medical records. Mongoose provides a schema-based solution for modeling application data.
*   **RTK Query:** RTK Query is a powerful data fetching and caching tool that simplifies data management in React applications.
*   **Socket.IO:** Socket.IO enables real-time communication between the server and clients, allowing for instant updates and notifications.
*   **AI Gemini:** Provide a concise medical summary.
*   **Express validator:** Provides functions that sanitizes and validates data.
*   **Winston:** Allows comprehensive and customizable logging capabilities

## Installation

Provide detailed, step-by-step instructions for setting up the project. Be very explicit!

**Backend Setup:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shef088/Hospital-Management-System
    cd /backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    *   Create a `.env` file in the `backend` directory.
    *   Visit https://aistudio.google.com/  and login. on their dashboard click on 'Get API key' button and generate the apikey. 
    *  Then copy your apikey to use in the .env file
    *  Add the following variables, replacing the placeholders with your actual values: 
  

    ```
    PORT=5000
    MONGO_URI=[Your MongoDB Connection String]
    JWT_SECRET=[Your JWT Secret Key]
    GOOGLE_AI_API_KEY=[Your Google AI API Key]
    NODE_ENV=development
    ```

4.  **Start the MongoDB Atlas database:**

    *   Ensure MongoDB is installed and running. You can use a local installation or a cloud-based service like MongoDB Atlas.

5. **Database Seeding (Very Important):**
    * This process is crucial for the app to work. So dont skip this step.
    * The seeder contains the default email and password for  superuser account which can be then used to create staff or patient accounts on the dashboard.
    *All patient/Staff created later by superadmin on the superadmin dashboard have their password same as their email address. They can later change it through the password reset page one they login.
    * To seed the database with initial data (roles, permissions, departments, and a super admin user), run the seeder script:

```bash
node seeder.js
```

6.   **Add your frontend url to cors options:**
    * Make sure you add your frontend url without the trailing slash to the cors options in the server.js if not available.

7.  **Run the backend:**

    ```bash
    node server.js
    ```

    This will start the server on port 5000 (or the port specified in your `.env` file).

**Frontend Setup:**

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    *   Open `src/constants/constants.ts` file in the `frontend` directory.
    *   Add replace placeholder with your backend URL:

    ```
    export const BASE_URL=http://localhost:5000  // Or your production backend URL(no trailing slash)
    ```

4.  **Run the frontend:**

    ```bash
    npm run dev
    ```

    * This will start the development server on `http://localhost:3000` (or the default Next.js port).


 

## License
This project is licensed under the MIT License - see the LICENSE file for details.

 
 
