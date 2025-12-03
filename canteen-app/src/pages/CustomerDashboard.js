import React, { useEffect, useState } from 'react';
import './CustomerDashboard.css';

const defaultMenu = [
  { id: 1, name: 'Veg Biryani', price: 120, image: '/images/veg-biryani.jpg' },
  { id: 2, name: 'Paneer Butter Masala', price: 150, image: '/images/paneer.jpg' },
  { id: 3, name: 'Chicken Curry', price: 180, image: '/images/chicken-curry.jpg' },
  { id: 4, name: 'Fried Rice', price: 100, image: '/images/fried-rice.jpg' },
  { id: 5, name: 'Gulab Jamun', price: 50, image: '/images/gulab-jamun.jpg' },
];

export default function CustomerDashboard() {
  const [menuData, setMenuData] = useState(() => JSON.parse(localStorage.getItem('dailyMenu')) || defaultMenu);
  const [selectedItems, setSelectedItems] = useState({}); // map id -> quantity
  const [formData, setFormData] = useState({ name: '', phone: '', altPhone: '', address: '', paymentType: 'Cash on Delivery' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const next = (e && e.detail) ? e.detail : JSON.parse(localStorage.getItem('dailyMenu')) || defaultMenu;
      setMenuData(next);
      // remove any selected items that no longer exist or are no longer available
      setSelectedItems((prev) => {
        const kept = {};
        Object.keys(prev).forEach((k) => {
          const id = Number(k);
          const found = next.find((m) => m.id === id && (m.available === undefined || m.available));
          if (found) kept[id] = prev[k];
        });
        return kept;
      });
    };

    // React to in-app updates (same tab)
    window.addEventListener('menuUpdated', handler);

    // React to changes coming from other tabs/windows via the storage event
    const onStorage = (ev) => {
      if (ev.key === 'dailyMenu') {
        try {
          const next = ev.newValue ? JSON.parse(ev.newValue) : [];
          setMenuData(next.length ? next : defaultMenu);
          setSelectedItems((prev) => {
            const kept = {};
            Object.keys(prev).forEach((k) => {
              const id = Number(k);
              const found = next.find((m) => m.id === id && (m.available === undefined || m.available));
              if (found) kept[id] = prev[k];
            });
            return kept;
          });
        } catch (err) {
          // ignore parse errors
        }
      }
    };
    window.addEventListener('storage', onStorage);

    // sync on mount in case menu changed while app was closed
    handler();

    return () => {
      window.removeEventListener('menuUpdated', handler);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const addOne = (item) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      next[item.id] = (next[item.id] || 0) + 1;
      return next;
    });
  };

  const removeOne = (item) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (!next[item.id]) return next;
      next[item.id] = next[item.id] - 1;
      if (next[item.id] <= 0) delete next[item.id];
      return next;
    });
  };

  const handleSelect = (item) => {
    // clicking the card toggles: if item selected, remove it entirely; otherwise add one
    const qty = selectedItems[item.id] || 0;
    if (qty > 0) {
      // remove all quantities for this item (unselect)
      setSelectedItems((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    } else {
      addOne(item);
    }
  };

  const total = Object.keys(selectedItems).reduce((acc, id) => {
    const qty = Number(selectedItems[id] || 0);
    const it = menuData.find((m) => m.id === Number(id));
    return acc + (it ? Number(it.price) * qty : 0);
  }, 0);

  const totalQty = Object.keys(selectedItems).reduce((s, k) => s + Number(selectedItems[k] || 0), 0);

  // basic form validation state derived from formData
  const isFormValid = Boolean(
    formData.name && formData.name.trim() &&
    formData.address && formData.address.trim() &&
    /^\d{10}$/.test(String(formData.phone || '').trim())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Validate again on submit in case user bypassed HTML constraints
    if (!formData.name || !formData.name.trim()) return alert('Please enter your name');
    if (!formData.address || !formData.address.trim()) return alert('Please enter delivery address');
    if (!/^\d{10}$/.test(String(formData.phone || '').trim())) return alert('Please enter a valid 10-digit phone number');

    const items = Object.keys(selectedItems).map((id) => {
      const it = menuData.find((m) => m.id === Number(id));
      if (!it) return null;
      return { ...it, quantity: Number(selectedItems[id] || 0) };
    }).filter(Boolean);

    setIsSubmitting(true);
    // Save order locally first so owner dashboard can show it
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = {
      id: Date.now(),
      items: items.map((i) => ({ id: i.id, name: i.name, description: i.description || '', price: Number(i.price), quantity: i.quantity || 1 })),
      total: Number(total),
      customer: { name: formData.name, phone: formData.phone, altPhone: formData.altPhone, address: formData.address },
      paymentType: formData.paymentType,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    try { window.dispatchEvent(new Event('ordersUpdated')); } catch (err) {}

    // Compose WhatsApp message and open chat to owner
    const itemsText = items.map((i) => `- ${i.name}${i.description ? ' (' + i.description + ')' : ''} x ${i.quantity || 1} — ₹${Number(i.price) * (i.quantity || 1)}`).join('\n');
    const message = [
      '*New Order*',
      `Ordered Menu:\n${itemsText}`,
      `Total Amount: ₹${Number(total)}`,
      `Delivery Address: ${formData.address}`,
      `Mode of Payment: ${formData.paymentType}`,
      `Customer: ${formData.name}`,
      `Contact: ${formData.phone}`,
    ].join('\n\n');

    // Use international format (country code + number) without plus or spaces
    const whatsappUrl = `https://wa.me/919490155198?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    // confirmation to the customer and reset form
    alert('Order submitted — owner will receive it shortly. A WhatsApp chat was opened for your confirmation.');
    setSelectedItems({});
    setFormData({ name: '', phone: '', altPhone: '', address: '', paymentType: 'Cash on Delivery' });
    setIsSubmitting(false);
  };

  return (
    <div className="dashboard">
      <h1>Today's Menu</h1>
      <div className="menu-container">
          {menuData.filter((m) => (m.available === undefined ? true : m.available)).map((item) => {
          const qty = selectedItems[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`menu-card ${qty > 0 ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item.image && <img src={item.image} alt={item.name} />}
              <h3>{item.name}</h3>
              {item.description && <p className="item-desc">{item.description}</p>}
              <p>₹{item.price}</p>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
                {qty > 0 ? (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); removeOne(item); }} style={{ padding: '6px 10px', borderRadius: 6 }}>-</button>
                    <div style={{ minWidth: 28, textAlign: 'center' }}>{qty}</div>
                    <button onClick={(e) => { e.stopPropagation(); addOne(item); }} style={{ padding: '6px 10px', borderRadius: 6 }}>+</button>
                  </>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); addOne(item); }} style={{ padding: '6px 10px', borderRadius: 6 }}>Add</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="order-section">
        <div className="summary">
          <h2>Your Order</h2>
          {totalQty === 0 ? (
            <p>No items selected</p>
          ) : (
            <>
              <ul>
                {Object.keys(selectedItems).map((id) => {
                  const it = menuData.find((m) => m.id === Number(id));
                  const qty = selectedItems[id] || 0;
                  return it ? (
                    <li key={id}>
                      {it.name}{it.description ? ` — ${it.description}` : ''} x {qty} — ₹{Number(it.price) * qty}
                    </li>
                  ) : null;
                })}
              </ul>
              <h3>Total: ₹{total}</h3>
            </>
          )}
        </div>

        <form className="order-form" onSubmit={handleSubmit}>
          <h2>Fill Your Details</h2>
            <input type="text" placeholder="Full Name" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              required
              maxLength={10}
              onChange={(e) => {
                const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: digits });
              }}
            />
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Alternative Phone (optional)"
              value={formData.altPhone}
              maxLength={10}
              onChange={(e) => {
                const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, altPhone: digits });
              }}
            />
            <textarea placeholder="Address" value={formData.address} required onChange={(e) => setFormData({ ...formData, address: e.target.value })}></textarea>
          <select value={formData.paymentType} onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}>
            <option>Cash on Delivery</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
          <button type="submit" disabled={totalQty === 0 || !isFormValid || isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Request'}</button>
        </form>
      </div>
    </div>
  );
}
