import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Accept only the specific allowed owner credentials
    const allowedEmail = 'yeswanth376@gmail.com';
    const allowedPassword = 'Yeswanth@123';

    // Trim whitespace and normalize email for comparison to avoid accidental spaces/case issues
    const enteredEmail = (email || '').trim().toLowerCase();
    const enteredPassword = (password || '').trim();

    if (enteredEmail === allowedEmail.toLowerCase() && enteredPassword === allowedPassword) {
      localStorage.setItem('role', 'owner');
      localStorage.setItem('currentUser', JSON.stringify({ name: 'Owner', email: allowedEmail }));
      navigate('/owner-dashboard');
    } else {
      setError('Invalid owner credentials. Check email, password, Caps Lock, and remove any extra spaces.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', color: '#ff7043' }}>Owner Login</h2>
      <form onSubmit={handleLogin}>
        <label style={{ display: 'block', marginTop: '12px', fontSize: '14px' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />

        <label style={{ display: 'block', marginTop: '12px', fontSize: '14px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />

        {error && <div style={{ color: 'crimson', marginTop: '10px' }}>{error}</div>}

        <button type="submit" style={{ marginTop: '16px', width: '100%', padding: '12px', background: '#ff7043', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Login
        </button>
      </form>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <span style={{ marginRight: '8px' }}>Don't have an account?</span>
        <Link to="/owner-signup" style={{ color: '#ff7043', fontWeight: '600' }}>Sign up</Link>
      </div>
    </div>
  );
};

export default OwnerLogin;
