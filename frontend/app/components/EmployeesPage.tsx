'use client';
import { useState } from 'react';
import { useApp } from '../lib/store';
import { Plane } from 'lucide-react';

export default function EmployeesPage() {
  const { employees, setPage, setViewingEmployee, currentRole } = useApp();
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const openProfile = (i: number) => {
    setViewingEmployee(i);
    setPage('profile');
  };

  return (
    <div className="page-view fade-in">
      <div className="toolbar">
        {currentRole === 'admin' && (
          <button className="btn btn-primary" onClick={() => { setViewingEmployee(0); setPage('profile'); }}>
            + New Employee
          </button>
        )}
        <input
          type="text"
          className="searchbar"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="emp-grid">
        {filtered.map((emp, i) => {
          const initials = emp.name.split(' ').map(n => n[0]).join('');
          return (
            <div key={emp.id} className="emp-card" onClick={() => openProfile(employees.indexOf(emp))}>
              {emp.status === 'plane'
                ? <Plane size={16} className="card-status status-plane" style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', color: 'var(--info)' }} />
                : <div className={`card-status status-${emp.status}`} />
              }
              <div className="avatar-large">{initials}</div>
              <div className="emp-name">{emp.name}</div>
              <div className="emp-role">{emp.role}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
