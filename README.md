# OrbitX

A modern Human Resource Management System built to simplify everyday HR operations for organizations.
Managing employees shouldn't require spreadsheets, endless paperwork, or switching between multiple tools. OrbitX brings employee management, attendance, leave requests, and payroll into one place with a clean and easy-to-use interface.

---

## Why we built OrbitX

During our research, we noticed that many small and medium-sized organizations still rely on manual processes for HR activities. Attendance is often maintained in registers, leave requests are handled over messages or emails, and employee information is scattered across different files.

These processes become difficult to manage as the organization grows.

OrbitX was built to solve this problem by providing one centralized platform where HR teams and employees can manage everything from a single dashboard.

---

## What OrbitX can do

### Employee Management

- Create and manage employee profiles
- Auto-generate Employee IDs
- Store personal and professional information
- Upload profile pictures and documents
- Edit employee details whenever required

### Attendance

- Daily Check-In / Check-Out
- Working hour calculation
- Attendance history
- Present, Absent, Half-Day and Leave status

### Leave Management

Employees can

- Apply for leave
- Select leave dates
- Add remarks
- Track approval status

HR/Admin can

- Review requests
- Approve or reject leave
- Add comments

---

### Payroll

- View employee salary
- Manage salary structure
- Configure allowances and deductions
- Read-only payroll access for employees

---

### Secure Authentication

OrbitX uses **Firebase Authentication** to securely manage user accounts.

Employees cannot create accounts themselves.

Instead,

- Company Admin creates employee accounts.
- Employees receive their login credentials.
- On their first login, they are required to change their password.

This keeps the system secure and prevents unauthorized registrations.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage

## How it works

```text
Company Registration
        │
        ▼
Admin Dashboard
        │
        ▼
Create Employee
        │
        ▼
Employee Login
        │
        ▼
Attendance
        │
        ▼
Leave Requests
        │
        ▼
Approval Process
        │
        ▼
Payroll
```

---

## Running the project

Clone the repository

```bash
git clone https://github.com/your-username/orbitx.git
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file and add your Firebase configuration.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Start the development server

```bash
npm run dev
```

---

## Future Improvements

If we continue developing OrbitX, we'd like to add:

- Email notifications
- Mobile application
- AI-powered resume parsing
- Performance tracking
- Recruitment module
- Employee self-service portal
- Analytics dashboard
- Shift scheduling

---or taking the time to check out OrbitX.

We hope it demonstrates how HR management can be made simpler, more organized, and more efficient using modern web technologies.
