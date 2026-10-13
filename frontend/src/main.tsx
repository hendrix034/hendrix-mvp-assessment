import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api, AuthUser, getCurrentUser, login, logout } from './api/client';

type Location = { id: number; name: string };

function Login({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [email, setEmail] = useState('manager@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { onLogin(await login(email, password)); } catch (err) { setError('Login failed'); }
  }
  return <div className="container py-5" style={{ maxWidth: 480 }}>
    <h1 className="h3 mb-3">Assessment Starter</h1>
    <form onSubmit={submit} className="card card-body">
      {error && <div className="alert alert-danger">{error}</div>}
      <label className="form-label">Email</label>
      <input className="form-control mb-2" value={email} onChange={e => setEmail(e.target.value)} />
      <label className="form-label">Password</label>
      <input className="form-control mb-3" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary">Login</button>
      <p className="text-muted small mt-3 mb-0">Try manager@example.com or inspector@example.com. Password: password.</p>
    </form>
  </div>;
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => { if (user) api<Location[]>('/locations').then(setLocations).catch(console.error); }, [user]);
  if (!user) return <Login onLogin={setUser} />;
  return <div className="container py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div><h1 className="h3 mb-0">Safety Inspections</h1><div className="text-muted">Logged in as {user.name} ({user.role})</div></div>
      <button className="btn btn-outline-secondary" onClick={() => { logout(); setUser(null); }}>Logout</button>
    </div>
    <div className="alert alert-info">Candidate task: add the Safety Inspections workflow here.</div>
    <div className="card">
      <div className="card-header">Existing locations endpoint</div>
      <ul className="list-group list-group-flush">{locations.map(l => <li className="list-group-item" key={l.id}>{l.name}</li>)}</ul>
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
