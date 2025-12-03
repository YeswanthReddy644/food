import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header
      style={{
        backgroundColor: '#ff7043',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* LEFT SIDE: Logo + Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          {/* Place a logo image at public/images/logo.png (licensed image). */}
          <img
            src="/images/logo.svg"
            alt="ANNAPURNA HOMELY FOOD logo"
            style={{ height: '44px', width: '44px', objectFit: 'cover', borderRadius: '6px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span>ANNAPURNA HOMELY FOOD</span>
        </Link>

        {(() => {
          const linkStyle = {
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          };

          const isCustomerDash = location.pathname && location.pathname.startsWith('/customer-dashboard');
          const isOwnerDash = location.pathname && location.pathname.startsWith('/owner-dashboard');
          const to = isOwnerDash ? '/owner-dashboard' : (isCustomerDash ? '/' : '/');
          const aria = isOwnerDash ? 'Back to Owner Dashboard' : (isCustomerDash ? 'Back to Home' : 'Home');

          return (
            <Link to={to} style={linkStyle} aria-label={aria}>
              {(isOwnerDash || isCustomerDash) ? '← Back' : 'Home'}
            </Link>
          );
        })()}
      </div>

      {/* RIGHT SIDE: Login / Logout */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'transparent', padding: 0 }}>
        {(() => {
          const btnStyle = {
            background: '#ffffff',
            color: '#ff7043',
            padding: '8px 14px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            border: 'none',
            display: 'inline-block',
          };

          // show the same styled control whether role exists or not
          return (
            <Link to="/owner-login" style={btnStyle}>
              Owner Login
            </Link>
          );
        })()}
      </nav>
    </header>
  );
}

export default Header;
