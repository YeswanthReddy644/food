import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }

    // load users
    const usersJson = localStorage.getItem('users') || '[]';
    let users = [];
    try {
      users = JSON.parse(usersJson);
    } catch (err) {
      users = [];
    }

    if (users.find((u) => u.email === email)) {
      setError('An account with this email already exists. Please login.');
      return;
    }

    const newUser = { name: name.trim(), email: email.trim(), password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // auto-login
    localStorage.setItem('role', 'customer');
    localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, email: newUser.email }));

    navigate('/customer-dashboard');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', color: '#ff7043' }}>Customer Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label style={{ display: 'block', marginTop: '12px', fontSize: '14px' }}>Full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />

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
          minLength={6}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />

        {error && <div style={{ color: 'crimson', marginTop: '10px' }}>{error}</div>}

        <button type="submit" style={{ marginTop: '16px', width: '100%', padding: '12px', background: '#ff7043', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Create account
        </button>
      </form>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <span style={{ marginRight: '8px' }}>Already have an account?</span>
        <Link to="/customer-login" style={{ color: '#ff7043', fontWeight: '600' }}>Login</Link>
      </div>
    </div>
  );
};

export default CustomerSignup;
