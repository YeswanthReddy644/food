import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Auto-login customer: user clicks "Customer Login" and is taken directly to dashboard
const CustomerLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set role and redirect immediately
    try {
      localStorage.setItem('role', 'customer');
    } catch (e) {
      // ignore
    }
    navigate('/customer-dashboard');
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <p style={{ color: '#777' }}>Redirecting to customer dashboard...</p>
    </div>
  );
};

export default CustomerLogin;
