'use client';
import { useState } from 'react';
import { useApp } from '../lib/store';
import { Sun, Moon, Menu, User, LogOut, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import EmployeesPage from './EmployeesPage';
import AttendancePage from './AttendancePage';
import TimeOffPage from './TimeOffPage';
import ProfilePage from './ProfilePage';

type NavPage = 'employees' | 'attendance' | 'timeoff' | 'profile';

export default function AppShell() {
  const { theme, toggleTheme, logout, isCheckedIn, toggleCheckIn, currentPage, setPage, userName, currentRole } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const navItems: { id: NavPage; label: string }[] = [
    { id: 'employees', label: 'Employees' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'timeoff', label: 'Time Off' },
  ];

  const handleCheckInOut = () => {
    toggleCheckIn();
    toast.success(isCheckedIn ? 'Successfully Checked OUT' : 'Successfully Checked IN');
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  return (
    <div style={{ minHeight: '100vh' }} onClick={e => {
      if (!(e.target as HTMLElement).closest('.avatar-container')) setDropdownOpen(false);
      if (!(e.target as HTMLElement).closest('.side-menu') && !(e.target as HTMLElement).closest('.mobile-menu-btn')) setSideOpen(false);
    }}>
      {/* Sidebar */}
      <aside className="side-menu" style={{ transform: sideOpen ? 'translateX(0)' : 'translateX(-110%)' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Menu</div>
        {navItems.map(n => (
          <a key={n.id} className="side-item" href="#" onClick={e => { e.preventDefault(); setPage(n.id); setSideOpen(false); }}>{n.label}</a>
        ))}
        <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
        <a className="side-item" href="#" onClick={e => { e.preventDefault(); setPage('profile'); setSideOpen(false); }}>My Profile</a>
      </aside>

      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex' }}
            onClick={e => { e.stopPropagation(); setSideOpen(p => !p); }}>
            <Menu size={24} />
          </button>
          <div className="logo-slot-md"><span className="company-logo-text">OrbitX</span></div>
          <nav className="nav-tabs">
            {navItems.map(n => (
              <div key={n.id} className={`nav-tab${currentPage === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>{n.label}</div>
            ))}
          </nav>
        </div>

        <div className="topbar-right">
          <div className={`status-indicator${isCheckedIn ? ' checked-in' : ''}`} title="Check-in Status" />

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="avatar-container" onClick={e => { e.stopPropagation(); setDropdownOpen(p => !p); }}>
            <div className="avatar">{initials}</div>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}>
              <div className="dropdown-item" onClick={() => { setPage('profile'); setDropdownOpen(false); }}>
                <User size={16} /> My Profile
              </div>
              <div className="dropdown-item" onClick={handleCheckInOut}>
                <span>{isCheckedIn ? 'Check Out' : 'Check IN'}</span>
                {isCheckedIn ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
              <div className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                <LogOut size={16} /> Log Out
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main className="main-content">
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'attendance' && <AttendancePage />}
        {currentPage === 'timeoff' && <TimeOffPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}
