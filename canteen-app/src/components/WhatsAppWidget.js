import React from 'react';
import './WhatsAppWidget.css';

// ownerNumber: use international format without + or spaces. For India use '91' + mobile, e.g. '919490155198'
const OWNER_NUMBER = '919490155198';

export default function WhatsAppWidget({ message = '' }) {
  const openChat = () => {
    const text = message || 'Hello, I would like to place an order.';
    const url = `https://wa.me/${OWNER_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <button className="wa-widget" onClick={openChat} aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.93 11.93 0 0012 .5C6.21.5 1.5 5.21 1.5 11c0 1.9.5 3.68 1.47 5.27L1 23l6.97-1.82A11.93 11.93 0 0012 22.5c5.79 0 10.5-4.71 10.5-10.5 0-3.02-1.18-5.83-3.98-7.52zM12 20.5c-1.12 0-2.22-.22-3.22-.64l-.23-.09-4.14 1.08 1.12-3.96-.07-.26A8.51 8.51 0 013.5 11c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5S16.69 20.5 12 20.5z" />
        <path d="M17.6 14.2c-.3-.15-1.8-.9-2.08-1-.28-.12-.48-.18-.68.18-.2.36-.77 1-.95 1.2-.18.2-.35.24-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.82-1.68-2.12-.17-.3-.02-.46.13-.61.13-.13.3-.33.45-.5.15-.17.2-.28.3-.47.1-.18.05-.35-.03-.5-.08-.15-.68-1.64-.93-2.25-.24-.59-.48-.51-.66-.52-.17-.01-.37-.01-.57-.01s-.5.07-.77.35c-.26.28-1 1-1 2.5s1.03 2.9 1.17 3.1c.13.2 2.03 3.1 4.92 4.35 1.72.74 2.63.83 3.57.67.58-.1 1.8-.73 2.06-1.44.26-.7.26-1.3.18-1.44-.08-.14-.28-.2-.58-.35z" />
      </svg>
      <span className="wa-text">Chat</span>
    </button>
  );
}
