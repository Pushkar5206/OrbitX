'use client';
import { useState } from 'react';
import { initialTimeOffReqs, TimeOffRequest } from '../lib/data';
import { toast } from 'sonner';
import TimeOffModal from './TimeOffModal';

const MONTHS = [
  { name: 'January 2026', offset: 3 },
  { name: 'February 2026', offset: 0 },
  { name: 'March 2026', offset: 1 },
  { name: 'April 2026', offset: 4 },
  { name: 'May 2026', offset: 6 },
  { name: 'June 2026', offset: 2 },
];

function MiniCalendar({ name, offset }: { name: string; offset: number }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div className="month-box">
      <div className="month-title">{name}</div>
      <div className="days-grid">
        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {days.map(d => <div key={d} className={d === 15 ? 'day active' : 'day'}>{d}</div>)}
      </div>
    </div>
  );
}

export default function TimeOffPage() {
  const [innerTab, setInnerTab] = useState<'timeoff' | 'allocation'>('timeoff');
  const [view, setView] = useState<'admin' | 'employee'>('admin');
  const [requests, setRequests] = useState<TimeOffRequest[]>(initialTimeOffReqs);
  const [modalOpen, setModalOpen] = useState(false);

  const approve = (id: number) => { setRequests(p => p.filter(r => r.id !== id)); toast.success('Approved'); };
  const reject = (id: number) => { setRequests(p => p.filter(r => r.id !== id)); toast.error('Rejected'); };

  return (
    <div className="page-view fade-in">
      <div className="inner-tabs" style={{ marginBottom: '1rem' }}>
        <div className={`inner-tab${innerTab === 'timeoff' ? ' active' : ''}`} onClick={() => setInnerTab('timeoff')}>Time Off</div>
        <div className={`inner-tab${innerTab === 'allocation' ? ' active' : ''}`} onClick={() => setInnerTab('allocation')}>Allocation</div>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New</button>
        <input type="text" className="searchbar" placeholder="Search..." />
        <select className="searchbar" value={view} onChange={e => setView(e.target.value as 'admin' | 'employee')} style={{ maxWidth: 150, padding: '0.2rem 1rem' }}>
          <option value="admin">Admin View</option>
          <option value="employee">Employee View</option>
        </select>
      </div>

      <div className="summary-boxes" style={{ marginBottom: '2rem' }}>
        <div className="summary-box" style={{ borderTop: '4px solid var(--info)' }}>
          <div style={{ color: 'var(--info)', fontSize: '1.2rem', fontWeight: 'bold' }}>Paid Time Off</div>
          <div className="value">24</div><div>Days Available</div>
        </div>
        <div className="summary-box" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>Sick Time Off</div>
          <div className="value">07</div><div>Days Available</div>
        </div>
      </div>

      {view === 'admin' ? (
        <div className="table-responsive">
          <table className="data">
            <thead>
              <tr><th>Name</th><th>Start Date</th><th>End Date</th><th>Time Off Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{req.name}</td><td>{req.start}</td><td>{req.end}</td>
                  <td style={{ color: req.type.includes('Paid') ? 'var(--info)' : 'var(--primary)', fontWeight: 'bold' }}>{req.type}</td>
                  <td style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon-danger" onClick={() => reject(req.id)}>✕</button>
                    <button className="btn-icon-success" onClick={() => approve(req.id)}>✓</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Annual Calendar Overview</h3>
          <div className="calendar-grid">
            {MONTHS.map(m => <MiniCalendar key={m.name} name={m.name} offset={m.offset} />)}
          </div>
        </div>
      )}

      <TimeOffModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
