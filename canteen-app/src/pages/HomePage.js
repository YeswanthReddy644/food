import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Add fade-in animation when page loads
    setFadeIn(true);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        animation: fadeIn ? 'fadeIn 1.2s ease-in' : '',
      }}
    >
      {/* LOGO SECTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <img
          src="/images/logo.svg"
          alt="ANNAPURNA HOMELY FOOD Logo"
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'transform 0.4s ease',
            display: 'block',
            padding: '8px',
            background: '#fff0eb',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      {/* TITLE */}
      <h1
        style={{
          color: '#ff7043',
          fontSize: '42px',
          fontWeight: 'bold',
          textShadow: '2px 2px 8px rgba(0,0,0,0.15)',
          marginBottom: '10px',
        }}
      >
        🍽️ Welcome to ANNAPURNA HOMELY FOOD
      </h1>

      {/* SUBTITLE */}
      <p
        style={{
          color: '#5d4037',
          fontSize: '18px',
          marginBottom: '40px',
        }}
      >
        Fresh, fast, and homemade meals — served with love every day!
      </p>

      {/* BUTTONS */}
      <div>
        <button
          onClick={() => navigate('/customer-login')}
          style={{
            backgroundColor: '#ff7043',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            margin: '10px',
            borderRadius: '30px',
            fontSize: '17px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          👤 Customer Login
        </button>
      </div>

      {/* ANIMATION KEYFRAMES */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
