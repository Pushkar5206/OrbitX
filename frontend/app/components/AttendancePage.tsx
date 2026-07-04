'use client';
import { useState } from 'react';
import { attendanceAdmin, attendanceEmp } from '../lib/data';

export default function AttendancePage() {
  const [view, setView] = useState<'admin' | 'employee'>('admin');

  return (
    <div className="page-view fade-in">
      <div className="toolbar">
        <h2 style={{ fontSize: '1.5rem' }}>Attendance</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>View As:</span>
          <select className="searchbar" value={view} onChange={e => setView(e.target.value as 'admin' | 'employee')} style={{ padding: '0.2rem 1rem' }}>
            <option value="admin">Admin/HR Officer</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {view === 'employee' && (
          <div className="summary-boxes">
            <div className="summary-box"><div className="value">22</div><div>Days Present</div></div>
            <div className="summary-box"><div className="value">03</div><div>Leaves Count</div></div>
            <div className="summary-box"><div className="value">25</div><div>Total Working Days</div></div>
          </div>
        )}

        <div className="toolbar" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline">←</button>
            <button className="btn btn-outline">→</button>
            <select className="btn btn-outline"><option>Oct</option></select>
            {view === 'admin' && <button className="btn btn-outline">Day</button>}
          </div>
          {view === 'admin' && <input type="text" className="searchbar" placeholder="Search..." />}
        </div>

        <div style={{ padding: '1rem 0', fontWeight: 'bold', borderBottom: '2px solid var(--border)' }}>22, October 2025</div>

        <div className="table-responsive">
          <table className="data">
            <thead>
              <tr>
                {view === 'admin' ? <th>Employee</th> : <th>Date</th>}
                <th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {view === 'admin'
                ? attendanceAdmin.map((a, i) => (
                  <tr key={i}><td>{a.emp}</td><td>{a.in}</td><td>{a.out}</td><td>{a.work}</td><td>{a.extra}</td></tr>
                ))
                : attendanceEmp.map((a, i) => (
                  <tr key={i}><td>{a.date}</td><td>{a.in}</td><td>{a.out}</td><td>{a.work}</td><td>{a.extra}</td></tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
