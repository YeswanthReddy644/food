import React, { useState } from 'react';

function OrderForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    paymentType: 'Cash on Delivery',
  });

  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrder = () => {
    const item = prompt('Enter item name:');
    const qty = prompt('Enter quantity:');
    if (item && qty) {
      setOrders([...orders, { item, qty }]);
    }
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      orders.length === 0
    ) {
      alert('Please fill all details and add at least one order.');
      return;
    }

    // Format WhatsApp message
    const message = `
🧾 *New Order Received!*
----------------------------
👤 *Name:* ${form.name}
📞 *Phone:* ${form.phone}
📱 *Alt Phone:* ${form.altPhone || 'N/A'}
🏠 *Address:* ${form.address}
💰 *Payment Type:* ${form.paymentType}

🛒 *Orders:*
${orders.map((o, i) => `${i + 1}. ${o.item} - ${o.qty}`).join('\n')}
----------------------------
📅 *Time:* ${new Date().toLocaleString()}
    `;

    // ✅ Owner's WhatsApp number (country code +91 + number, no + sign)
    const ownerNumber = '919490155198';
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp with the prefilled message
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '30px auto',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ color: '#ff7043', textAlign: 'center' }}>🧾 Place Your Order</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="altPhone"
        placeholder="Alternative Phone (optional)"
        value={form.altPhone}
        onChange={handleChange}
        style={inputStyle}
      />

      <textarea
        name="address"
        placeholder="Delivery Address"
        value={form.address}
        onChange={handleChange}
        style={{ ...inputStyle, height: '80px' }}
      />

      <select
        name="paymentType"
        value={form.paymentType}
        onChange={handleChange}
        style={inputStyle}
      >
        <option>Cash on Delivery</option>
        <option>Online Payment</option>
      </select>

      {/* Order Items */}
      <div style={{ marginTop: '20px' }}>
        <h3>🛒 Your Orders</h3>
        {orders.length === 0 ? (
          <p style={{ color: '#888' }}>No items added yet.</p>
        ) : (
          <ul style={{ textAlign: 'left' }}>
            {orders.map((o, i) => (
              <li key={i}>
                {o.item} - {o.qty}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleAddOrder} style={btnAddStyle}>
          ➕ Add Item
        </button>
      </div>

      <button onClick={handleSubmit} style={btnSendStyle}>
        📤 Send Request
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '15px',
};

const btnAddStyle = {
  backgroundColor: '#ffcc80',
  color: '#5d4037',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  marginTop: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const btnSendStyle = {
  backgroundColor: '#ff7043',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '8px',
  marginTop: '25px',
  width: '100%',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
};

export default OrderForm;
