export type EmployeeStatus = 'green' | 'yellow' | 'plane';

export interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: EmployeeStatus;
  email: string;
  phone: string;
  manager: string;
  location: string;
  monthSalary: number;
  skills: string[];
  certs: string[];
  resume: string;
  love?: string;
  hobbies?: string;
}

export const employees: Employee[] = [
  { id: 'EMP001', name: 'John Doe', role: 'Management', dept: 'Management', status: 'green', email: 'john.doe@example.com', phone: '+91 9000000001', manager: 'Director', location: 'Head Office', monthSalary: 50000, skills: ['Leadership'], certs: [], resume: 'Experienced manager...', love: 'Building great teams', hobbies: 'Reading, Cycling' },
  { id: 'EMP002', name: 'Emily Chen', role: 'Design', dept: 'Design', status: 'yellow', email: 'emily.chen@example.com', phone: '+91 9000000002', manager: 'Design Lead', location: 'Design Studio', monthSalary: 42000, skills: ['UI/UX'], certs: [], resume: 'Product designer...', love: 'Creating beautiful interfaces', hobbies: 'Sketching, Photography' },
  { id: 'EMP003', name: 'Marcus J', role: 'Engineering', dept: 'Engineering', status: 'plane', email: 'marcus.j@example.com', phone: '+91 9000000003', manager: 'Eng Manager', location: 'Remote', monthSalary: 65000, skills: ['Python', 'Systems'], certs: [], resume: 'Backend engineer...', love: 'Solving hard problems', hobbies: 'Open-source, Gaming' },
  { id: 'EMP004', name: 'Sarah W', role: 'Marketing', dept: 'Marketing', status: 'green', email: 'sarah.w@example.com', phone: '+91 9000000004', manager: 'CMO', location: 'Head Office', monthSalary: 38000, skills: ['Content'], certs: [], resume: 'Marketing specialist...', love: 'Storytelling', hobbies: 'Writing, Travel' },
  { id: 'EMP005', name: 'Michael T', role: 'Sales', dept: 'Sales', status: 'yellow', email: 'michael.t@example.com', phone: '+91 9000000005', manager: 'Sales Head', location: 'Region Office', monthSalary: 34000, skills: ['Negotiation'], certs: [], resume: 'Sales executive...', love: 'Closing deals', hobbies: 'Sports, Networking' },
  { id: 'EMP006', name: 'Anna B', role: 'HR', dept: 'HR', status: 'green', email: 'anna.b@example.com', phone: '+91 9000000006', manager: 'HR Head', location: 'Head Office', monthSalary: 47000, skills: ['Recruiting'], certs: [], resume: 'HR specialist...', love: 'People development', hobbies: 'Yoga, Reading' },
];

export const attendanceAdmin = [
  { emp: 'John Doe', in: '10:00', out: '19:00', work: '09:00', extra: '01:00' },
  { emp: 'Emily Chen', in: '--:--', out: '--:--', work: '--:--', extra: '--:--' },
  { emp: 'Sarah W', in: '09:30', out: '18:30', work: '09:00', extra: '00:00' },
];

export const attendanceEmp = [
  { date: '28/10/2025', in: '10:00', out: '19:00', work: '09:00', extra: '01:00' },
  { date: '29/10/2025', in: '10:00', out: '19:00', work: '09:00', extra: '01:00' },
];

export interface TimeOffRequest {
  id: number;
  name: string;
  start: string;
  end: string;
  type: string;
}

export const initialTimeOffReqs: TimeOffRequest[] = [
  { id: 1, name: 'Marcus J', start: '28/10/2025', end: '30/10/2025', type: 'Paid time Off' },
  { id: 2, name: 'Emily Chen', start: '01/11/2025', end: '02/11/2025', type: 'Sick time off' },
];
