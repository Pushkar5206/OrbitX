'use client';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface Props { open: boolean; onClose: () => void; }

export default function TimeOffModal({ open, onClose }: Props) {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request Submitted');
    onClose();
  };

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>Time Off Request</h3>
          <button className="btn btn-outline" style={{ border: 'none', padding: '0.2rem' }} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 2 }}>
              <div className="field"><label>Employee</label><input type="text" defaultValue="[Employee Name]" disabled /></div>
              <div className="field">
                <label>Time Off Type</label>
                <select>
                  <option>Paid Time Off</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leaves</option>
                </select>
              </div>
              <div className="field-row">
                <div className="field"><label>From</label><input type="date" /></div>
                <div className="field"><label>To</label><input type="date" /></div>
              </div>
              <div className="field"><label>Allocation (Days)</label><input type="number" defaultValue="1" /></div>
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ margin: 0 }}>Attachment:</label>
                <button type="button" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem' }}><Upload size={16} /></button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>(For sick leave certificate)</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: '#fffbeb', border: '1px dashed #fbbf24', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}>
                <strong style={{ textDecoration: 'underline' }}>TimeOff Types:</strong><br />
                - Paid Time Off<br />- Sick Leave<br />- Unpaid Leaves
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Discard</button>
          </div>
        </form>
      </div>
    </div>
  );
}
