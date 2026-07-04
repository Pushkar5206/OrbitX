-- ============================================================
-- HRMS database schema for Supabase (PostgreSQL)
-- Run this in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------------- Companies ----------------
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ---------------- Employees (linked 1:1 with auth.users) ----------------
create table if not exists employees (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  employee_code text unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  role text not null default 'employee' check (role in ('admin','employee')),
  department text,
  job_position text,
  manager text,
  location text,
  status text default 'present' check (status in ('present','absent','leave')),
  avatar_url text,
  about text,
  skills text[] default '{}',
  interests text[] default '{}',
  certifications text[] default '{}',
  date_of_birth date,
  residing_address text,
  nationality text,
  personal_email text,
  gender text,
  marital_status text,
  date_of_joining date,
  bank_account_number text,
  bank_name text,
  ifsc_code text,
  pan_no text,
  uan_id text,
  esp_code text,
  created_at timestamptz not null default now()
);

-- ---------------- Attendance ----------------
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  date date not null default current_date,
  check_in timestamptz,
  check_out timestamptz,
  work_hours numeric default 0,
  extra_hours numeric default 0,
  created_at timestamptz not null default now(),
  unique (employee_id, date)
);

-- ---------------- Leave / Time Off requests ----------------
create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  leave_type text not null check (leave_type in ('paid','sick','unpaid')),
  start_date date not null,
  end_date date not null,
  days numeric not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  remarks text,
  attachment_url text,
  created_at timestamptz not null default now()
);

-- ---------------- Salary structures ----------------
create table if not exists salary_structures (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid unique references employees(id) on delete cascade,
  wage_type text default 'fixed',
  monthly_wage numeric default 0,
  yearly_wage numeric default 0,
  working_days_per_week numeric default 5,
  break_time_hours numeric default 1,
  basic_pct numeric default 50,
  hra_pct numeric default 50,
  standard_allowance numeric default 4167,
  performance_bonus_pct numeric default 8.33,
  leave_travel_pct numeric default 8.33,
  pf_employee_pct numeric default 12,
  pf_employer_pct numeric default 12,
  professional_tax numeric default 200,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table companies enable row level security;
alter table employees enable row level security;
alter table attendance enable row level security;
alter table leave_requests enable row level security;
alter table salary_structures enable row level security;

-- Helper: get current user's company_id and role quickly
create or replace function my_company_id() returns uuid as $$
  select company_id from employees where id = auth.uid();
$$ language sql stable security definer;

create or replace function my_role() returns text as $$
  select role from employees where id = auth.uid();
$$ language sql stable security definer;

-- ---- companies ----
create policy "Members can view own company" on companies
  for select using (id = my_company_id());
create policy "Anyone signed in can create a company (signup flow)" on companies
  for insert with check (auth.uid() is not null);

-- ---- employees ----
create policy "Employees can view colleagues in their company" on employees
  for select using (company_id = my_company_id());
create policy "Employees can update their own limited profile" on employees
  for update using (id = auth.uid());
create policy "Admins can update any employee in their company" on employees
  for update using (my_role() = 'admin' and company_id = my_company_id());
create policy "Self-insert during signup" on employees
  for insert with check (id = auth.uid());
create policy "Admins can insert employees in their company" on employees
  for insert with check (my_role() = 'admin' and company_id = my_company_id());

-- ---- attendance ----
create policy "View own attendance" on attendance
  for select using (employee_id = auth.uid());
create policy "Admins view all company attendance" on attendance
  for select using (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));
create policy "Insert own attendance" on attendance
  for insert with check (employee_id = auth.uid());
create policy "Update own attendance" on attendance
  for update using (employee_id = auth.uid());

-- ---- leave_requests ----
create policy "View own leave requests" on leave_requests
  for select using (employee_id = auth.uid());
create policy "Admins view all company leave requests" on leave_requests
  for select using (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));
create policy "Insert own leave request" on leave_requests
  for insert with check (employee_id = auth.uid());
create policy "Admins can update (approve/reject) leave requests" on leave_requests
  for update using (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));

-- ---- salary_structures ----
create policy "View own salary (read-only for employees)" on salary_structures
  for select using (employee_id = auth.uid());
create policy "Admins view all company salaries" on salary_structures
  for select using (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));
create policy "Admins manage salary structures" on salary_structures
  for insert with check (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));
create policy "Admins update salary structures" on salary_structures
  for update using (my_role() = 'admin' and employee_id in (select id from employees where company_id = my_company_id()));
