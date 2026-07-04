const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AuthEmployee {
  id: string;
  user_id?: string;
  login_id?: string;
  name: string;
  email: string;
  role: string;
  company_name?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
  employee: AuthEmployee;
  userId?: string;
  companyName?: string;
}

export interface SignupPayload {
  companyName: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

export interface SigninPayload {
  email?: string;
  loginId?: string;
  password: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.error || response.statusText || 'Request failed');
  }

  return body as T;
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function authHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(payload: SignupPayload) {
  return request<{ message: string; loginId: string; userId: string; employee: AuthEmployee; session: { accessToken: string; refreshToken?: string; expiresAt?: number } | null }>(
    '/api/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function signin(payload: SigninPayload) {
  return request<{ accessToken: string; refreshToken?: string; expiresAt?: number; employee: AuthEmployee; user: { id: string } }>(
    '/api/auth/signin',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchEmployees(token: string) {
  return request<{ employees?: AuthEmployee[]; employee?: AuthEmployee }>('/api/employees', {
    headers: authHeaders(token),
  });
}

export async function fetchAttendance(token: string) {
  return request<{ attendance: unknown[] }>('/api/attendance', {
    headers: authHeaders(token),
  });
}

export async function postAttendance(token: string, action?: 'check-in' | 'check-out') {
  return request<{ attendance: unknown }>('/api/attendance', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ action }),
  });
}

export async function fetchTimeOff(token: string) {
  return request<{ timeOff: unknown[] }>('/api/time-off', {
    headers: authHeaders(token),
  });
}

export async function submitTimeOff(token: string, payload: { startDate: string; endDate: string; type: string; reason?: string }) {
  return request<{ timeOff: unknown }>('/api/time-off', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateTimeOffStatus(token: string, id: string | number, status: 'approved' | 'rejected' | 'pending') {
  return request<{ timeOff: unknown }>(`/api/time-off/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}