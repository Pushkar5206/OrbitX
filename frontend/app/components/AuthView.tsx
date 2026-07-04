'use client';
import { useState } from 'react';
import { useApp } from '../lib/store';
import { toast } from 'sonner';
import { signin, signup } from '../lib/api';

export default function AuthView() {
  const { login } = useApp();
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);

  // Sign in state
  const [loginId, setLoginId] = useState('admin@example.com');
  const [loginPassword, setLoginPassword] = useState('password');

  // Sign up state
  const [regCompany, setRegCompany] = useState('Odoo India');
  const [regName, setRegName] = useState('John Doe');
  const [regEmail, setRegEmail] = useState('admin@example.com');
  const [regPhone, setRegPhone] = useState('+91 9876543210');
  const [regPassword, setRegPassword] = useState('password');
  const [regConfirm, setRegConfirm] = useState('password');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await signup({
        companyName: regCompany,
        name: regName,
        email: regEmail,
        password: regPassword,
        role: 'employee',
        phone: regPhone,
      });

      if (response.session?.accessToken) {
        login({
          accessToken: response.session.accessToken,
          refreshToken: response.session.refreshToken,
          expiresAt: response.session.expiresAt,
          employee: response.employee,
          userId: response.userId,
          companyName: regCompany,
        });
        toast.success(`Signed up successfully. Login ID: ${response.loginId}`);
        return;
      }

      setLoginId(response.loginId);
      setView('signin');
      toast.success(`Account created. Login ID: ${response.loginId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signin({
        loginId,
        password: loginPassword,
      });

      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
        employee: response.employee,
        userId: response.user.id,
      });

      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view">
      {view === 'signin' ? (
        <div className="glass-panel auth-card fade-in">
          <div className="auth-header">
            <div className="logo-slot-lg"><span className="company-logo-text">OrbitX</span></div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Login Id/Email :-</label>
              <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} />
            </div>
            <div className="field">
              <label>Password :-</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
              {loading ? 'WORKING...' : 'SIGN IN'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Don&apos;t have an Account?{' '}
            <a href="#" onClick={e => { e.preventDefault(); setView('signup'); }} style={{ color: 'var(--primary)' }}>Sign Up</a>
          </div>
        </div>
      ) : (
        <div className="glass-panel auth-card fade-in" style={{ maxWidth: 600 }}>
          <div className="auth-header">
            <div className="logo-slot-lg"><span className="company-logo-text">OrbitX</span></div>
          </div>
          <form onSubmit={handleSignup}>
            <div className="field-row">
              <div className="field"><label>Company Name :-</label><input value={regCompany} onChange={e => setRegCompany(e.target.value)} required /></div>
              <div className="field"><label>Name :-</label><input value={regName} onChange={e => setRegName(e.target.value)} required /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Email :-</label><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required /></div>
              <div className="field"><label>Phone :-</label><input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} required /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Password :-</label><input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required /></div>
              <div className="field"><label>Confirm Password :-</label><input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
              {loading ? 'WORKING...' : 'Sign Up'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <a href="#" onClick={e => { e.preventDefault(); setView('signin'); }} style={{ color: 'var(--primary)' }}>Sign In</a>
          </div>
          <div className="note-box">
            <strong>Note for ID Generation:</strong><br />
            Normal user cannot register. When HR creates user, ID is auto-generated: (First 2 letters of Company) + (First 2 letters of Name) + (Year) + (Serial).<br />
            Example: Odoo India, John Doe → <b>OIJODO20220001</b>
          </div>
        </div>
      )}
    </div>
  );
}
