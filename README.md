# OrbitX HRMS

A full-stack Human Resource Management System built with **Next.js** (frontend) and **Express + Supabase** (backend).

## Project Structure

```
orbitx/
├── backend/          # Express API server
│   ├── server.js     # Routes: auth, employees, attendance, time-off
│   ├── supabaseClient.js
│   └── .env.local    # SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
└── frontend/         # Next.js 16 app
    └── app/
        ├── components/   # UI pages & modals
        ├── lib/          # API client, store, static data
        ├── page.tsx
        └── layout.tsx
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm start          # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## Environment Variables

Create `backend/.env.local`:
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Features

- JWT-based auth (sign up / sign in) with auto-generated Login IDs
- Role-based access: **Admin** and **Employee** views
- Attendance tracking (check-in / check-out)
- Time-off requests with approval workflow
- Employee profiles with skills, certifications, and salary info
- Light / Dark theme toggle
