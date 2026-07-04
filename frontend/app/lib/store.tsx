'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { employees as initialEmployees, Employee } from './data';
import type { AuthSession } from './api';

type Theme = 'light' | 'dark';
type Role = 'admin' | 'employee';
type Page = 'employees' | 'attendance' | 'timeoff' | 'profile';

const AUTH_STORAGE_KEY = 'orbitxAuthSession';

function normalizeRole(role: string | undefined): Role {
  return String(role || '').toLowerCase() === 'admin' ? 'admin' : 'employee';
}

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  authToken: string | null;
  currentRole: Role;
  currentUserId: string | null;
  userName: string;
  companyName: string;
  isCheckedIn: boolean;
  currentPage: Page;
  viewingEmployeeIndex: number;
  employees: Employee[];
  login: (session: AuthSession) => void;
  logout: () => void;
  toggleCheckIn: () => void;
  setPage: (p: Page) => void;
  setViewingEmployee: (i: number) => void;
  updateEmployee: (i: number, emp: Employee) => void;
}

const AppContext = createContext<AppState>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>('employee');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('John Doe');
  const [companyName, setCompanyName] = useState('Odoo India');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('employees');
  const [viewingEmployeeIndex, setViewingEmployeeIndex] = useState(0);
  const [empList, setEmpList] = useState<Employee[]>(initialEmployees);

  useEffect(() => {
    const saved = (localStorage.getItem('hrmsTheme') as Theme) || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!savedSession) {
      return;
    }

    try {
      const session = JSON.parse(savedSession) as AuthSession & { companyName?: string };
      setAuthToken(session.accessToken);
      setIsLoggedIn(true);
      setCurrentRole(normalizeRole(session.employee?.role));
      setCurrentUserId(session.employee?.login_id || session.employee?.id || null);
      setUserName(session.employee?.name || 'John Doe');
      setCompanyName(session.companyName || session.employee?.company_name || 'Odoo India');
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('hrmsTheme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const login = (session: AuthSession) => {
    setAuthToken(session.accessToken);
    setIsLoggedIn(true);
    setCurrentRole(normalizeRole(session.employee.role));
    setCurrentUserId(session.employee.login_id || session.employee.id || session.userId || null);
    setUserName(session.employee.name);
    setCompanyName(session.companyName || session.employee.company_name || 'Odoo India');
    setCurrentPage('employees');

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setIsCheckedIn(false);
    setCurrentUserId(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const toggleCheckIn = () => setIsCheckedIn(p => !p);

  const updateEmployee = (i: number, emp: Employee) => {
    setEmpList(prev => prev.map((e, idx) => idx === i ? emp : e));
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      isLoggedIn, authToken, currentRole, currentUserId, userName, companyName,
      isCheckedIn, currentPage, viewingEmployeeIndex,
      employees: empList,
      login, logout, toggleCheckIn,
      setPage: setCurrentPage,
      setViewingEmployee: setViewingEmployeeIndex,
      updateEmployee,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
