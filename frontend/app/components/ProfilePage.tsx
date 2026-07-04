'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { toast } from 'sonner';
type ProfileTab = 'resume' | 'private' | 'salary';

function calcSalary(monthWage: number) {
  const basic = monthWage * 0.5;
  return {
    basic: basic.toFixed(2),
    hra: (basic * 0.5).toFixed(2),
    std: '4167.00',
    perf: (basic * 0.0833).toFixed(2),
    pf: (basic * 0.12).toFixed(2),
    tax: '200.00',
    year: (monthWage * 12).toFixed(2),
  };
}

export default function ProfilePage() {
  const { employees, viewingEmployeeIndex, currentRole, currentUserId, updateEmployee, companyName } = useApp();
  const emp = employees[viewingEmployeeIndex];

  const [tab, setTab] = useState<ProfileTab>('resume');
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState(emp?.resume || '');
  const [love, setLove] = useState(emp?.love || '');
  const [hobbies, setHobbies] = useState(emp?.hobbies || '');
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [monthWage, setMonthWage] = useState(emp?.monthSalary || 0);

  useEffect(() => {
    if (emp) {
      setAbout(emp.resume || '');
      setLove(emp.love || '');
      setHobbies(emp.hobbies || '');
      setMonthWage(emp.monthSalary || 0);
      setEditing(false);
      setTab('resume');
    }
  }, [viewingEmployeeIndex, emp]);

  if (!emp) return <div className="page-view">No employee selected.</div>;

  const isAdmin = currentRole === 'admin';
  const isOwnProfile = emp.id === currentUserId;
  const salary = calcSalary(monthWage);
  const initials = emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const saveProfile = () => {
    updateEmployee(viewingEmployeeIndex, { ...emp, resume: about, love, hobbies });
    setEditing(false);
    toast.success('Profile saved successfully');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateEmployee(viewingEmployeeIndex, { ...emp, skills: [...emp.skills, newSkill.trim()] });
    setNewSkill('');
    toast.success('Skill added');
  };

  const removeSkill = (i: number) => {
    updateEmployee(viewingEmployeeIndex, { ...emp, skills: emp.skills.filter((_, idx) => idx !== i) });
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    updateEmployee(viewingEmployeeIndex, { ...emp, certs: [...emp.certs, newCert.trim()] });
    setNewCert('');
    toast.success('Certification added');
  };

  const removeCert = (i: number) => {
    updateEmployee(viewingEmployeeIndex, { ...emp, certs: emp.certs.filter((_, idx) => idx !== i) });
  };

  const handleMonthChange = (val: number) => {
    setMonthWage(val);
    if (isAdmin) updateEmployee(viewingEmployeeIndex, { ...emp, monthSalary: val });
  };

  return (
    <div className="page-view fade-in">
      <div className="profile-layout">
        {/* Sidebar */}
        <div className="glass-panel profile-sidebar">
          <div className="avatar-xl">{initials}</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 0 }}>{emp.name}</h2>
          <div style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Company: {companyName}</div>
          <div className="profile-details">
            <p><strong>Login ID:</strong> <span>{emp.id}</span></p>
            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>Mobile:</strong> {emp.phone}</p>
            <p><strong>Department:</strong> {emp.dept}</p>
            <p><strong>Manager:</strong> {emp.manager}</p>
            <p><strong>Location:</strong> {emp.location}</p>
          </div>
        </div>

        {/* Content */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="inner-tabs">
            <div className={`inner-tab${tab === 'resume' ? ' active' : ''}`} onClick={() => setTab('resume')}>Resume</div>
            <div className={`inner-tab${tab === 'private' ? ' active' : ''}`} onClick={() => setTab('private')}>Private Info</div>
            {isAdmin && <div className={`inner-tab${tab === 'salary' ? ' active' : ''}`} onClick={() => setTab('salary')}>Salary Info</div>}
          </div>

          {/* Resume Tab */}
          {tab === 'resume' && (
            <div className="fade-in">
              <div className="field-row" style={{ alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>✏️ About</h3>
                  <textarea value={about} onChange={e => setAbout(e.target.value)} disabled={!editing} style={{ width: '100%', minHeight: 120, marginBottom: '1rem' }} />
                  {(isOwnProfile && !isAdmin) && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {!editing
                        ? <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit</button>
                        : <>
                          <button className="btn btn-primary" onClick={saveProfile}>Save</button>
                          <button className="btn btn-outline" onClick={() => { setAbout(emp.resume || ''); setEditing(false); toast.success('Edit canceled'); }}>Cancel</button>
                        </>
                      }
                    </div>
                  )}

                  <h3 style={{ borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>❤️ What I love about my job</h3>
                  <textarea value={love} onChange={e => setLove(e.target.value)} disabled={!editing} style={{ width: '100%', minHeight: 80, marginBottom: '1rem' }} />

                  <h3 style={{ borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>🚴 My interests and hobbies</h3>
                  <textarea value={hobbies} onChange={e => setHobbies(e.target.value)} disabled={!editing} style={{ width: '100%', minHeight: 80 }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', background: 'var(--surface-strong)' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Skills</h4>
                    <ul style={{ marginBottom: '0.5rem' }}>
                      {emp.skills.map((s, i) => (
                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.2rem 0' }}>
                          {s}
                          {(isAdmin || isOwnProfile) && <button className="btn btn-outline" style={{ padding: '0.1rem 0.4rem' }} onClick={() => removeSkill(i)}>×</button>}
                        </li>
                      ))}
                    </ul>
                    {(isAdmin || isOwnProfile) && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && addSkill()} />
                        <button className="btn btn-primary" onClick={addSkill}>Add</button>
                      </div>
                    )}
                  </div>

                  <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-strong)' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Certifications</h4>
                    <ul style={{ marginBottom: '0.5rem' }}>
                      {emp.certs.map((c, i) => (
                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.2rem 0' }}>
                          {c}
                          {(isAdmin || isOwnProfile) && <button className="btn btn-outline" style={{ padding: '0.1rem 0.4rem' }} onClick={() => removeCert(i)}>×</button>}
                        </li>
                      ))}
                    </ul>
                    {(isAdmin || isOwnProfile) && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input value={newCert} onChange={e => setNewCert(e.target.value)} placeholder="Add certification" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && addCert()} />
                        <button className="btn btn-primary" onClick={addCert}>Add</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Private Info Tab */}
          {tab === 'private' && (
            <div className="fade-in">
              <p style={{ color: 'var(--text-muted)' }}>Private employee information (Bank details, Emergency contacts) goes here.</p>
            </div>
          )}

          {/* Salary Tab */}
          {tab === 'salary' && isAdmin && (
            <div className="fade-in">
              <div className="note-box" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                <strong>Important:</strong> Salary components auto-update when wage changes. Total components should not exceed defined wage.
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Monthly Wage</label>
                  <input type="number" value={monthWage} onChange={e => handleMonthChange(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="field">
                  <label>Yearly Wage</label>
                  <input type="number" value={salary.year} disabled />
                </div>
                <div className="field">
                  <label>Working Days / Week</label>
                  <input type="number" defaultValue={5} />
                </div>
              </div>

              <div className="field-row" style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Salary Components</h4>
                  {[
                    { label: 'Basic Salary', sub: '50% of wage', val: salary.basic },
                    { label: 'House Rent Allowance', sub: '50% of basic', val: salary.hra },
                    { label: 'Standard Allowance', sub: 'Fixed amount', val: salary.std },
                    { label: 'Performance Bonus', sub: '8.33% of basic', val: salary.perf },
                  ].map(item => (
                    <div key={item.label} className="field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '60%' }}>
                        <strong>{item.label}</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{item.sub}</p>
                      </div>
                      <input type="text" value={item.val} disabled style={{ width: 120, textAlign: 'right' }} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Deductions</h4>
                  {[
                    { label: 'Provident Fund (PF)', sub: '12% of basic', val: salary.pf },
                    { label: 'Tax Deduction', sub: 'Professional Tax', val: salary.tax },
                  ].map(item => (
                    <div key={item.label} className="field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '60%' }}>
                        <strong>{item.label}</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{item.sub}</p>
                      </div>
                      <input type="text" value={item.val} disabled style={{ width: 120, textAlign: 'right' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
