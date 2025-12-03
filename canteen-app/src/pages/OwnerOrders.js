import React, { useState, useEffect } from 'react';
import { useConfirm } from '../contexts/ConfirmContext';

const OwnerOrders = ({ filter }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = () => {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      // dedupe orders by id or createdAt (keep last occurrence)
      const map = new Map();
      for (const o of savedOrders) {
        const key = o.id ?? o.createdAt ?? JSON.stringify(o);
        map.set(key, o);
      }
      const deduped = Array.from(map.values());
      setOrders(deduped);
    };

    load();
    window.addEventListener('ordersUpdated', load);
    return () => window.removeEventListener('ordersUpdated', load);
  }, []);

  const confirm = useConfirm();

  const markCompleted = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = 'Completed';
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    // dispatch a small event so other components can refresh if needed
    try {
      window.dispatchEvent(new Event('ordersUpdated'));
    } catch (e) {}
  };

  const removeOrder = async (index) => {
    // index is original index in orders
    const ok = await confirm('Permanently remove this order from history?', { showRemember: true, rememberKey: 'confirmClearHistory' });
    if (!ok) return;
    const updated = [...orders];
    updated.splice(index, 1);
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    try { window.dispatchEvent(new Event('ordersUpdated')); } catch (e) {}
  };

  const clearCompleted = async () => {
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    const hasCompleted = (stored || []).some((o) => ((o.status || '') + '').trim().toLowerCase() === 'completed');
    if (!hasCompleted) return alert('No completed orders to clear.');
    const ok = await confirm('This will permanently remove ALL completed orders. Continue?', { showRemember: true, rememberKey: 'confirmClearHistory' });
    if (!ok) return;
    const remaining = (stored || []).filter((o) => ((o.status || '') + '').trim().toLowerCase() !== 'completed');
    localStorage.setItem('orders', JSON.stringify(remaining));
    setOrders(remaining);
    try { window.dispatchEvent(new Event('ordersUpdated')); } catch (e) {}
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = Number(item.price ?? item.rate ?? 0) || 0;
      const qty = Number(item.quantity ?? item.qty ?? 1) || 1;
      return sum + price * qty;
    }, 0);
  };

  // apply optional filter prop
  const applyFilter = (ordersList) => {
    if (!filter || filter === 'all') return ordersList;
    if (filter === 'pending') return ordersList.filter((o) => { const s = ((o.status || 'Pending') + '').trim().toLowerCase(); return s === 'pending'; });
    if (filter === 'completed') return ordersList.filter((o) => { const s = ((o.status || '') + '').trim().toLowerCase(); return s === 'completed'; });
    return ordersList;
  };

  const filtered = applyFilter(orders);
  if (filtered.length === 0) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Customer Orders</h2>
        <div style={{ padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          No orders found for the selected view.
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Customer Orders</h2>
        <div>
          <button onClick={clearCompleted} style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Remove Completed Orders
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', color: '#374151', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Customer</th>
              <th style={{ padding: '12px 16px' }}>Contact</th>
              <th style={{ padding: '12px 16px' }}>Address</th>
              <th style={{ padding: '12px 16px' }}>Payment</th>
              <th style={{ padding: '12px 16px' }}>Items</th>
              <th style={{ padding: '12px 16px' }}>Total (₹)</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = filtered.map((order) => {
                const origIndex = orders.findIndex((o) => (o.id || o.createdAt) === (order.id || order.createdAt));
                return (
                  <tr key={order.id || origIndex} style={{ borderTop: '1px solid #eef2f7' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{(order.customer && order.customer.name) || order.name || '—'}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{(order.customer && order.customer.email) || order.email || ''}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div>{(((order.customer && order.customer.phone) || order.phone) + '').slice(0, 10) || '—'}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{(((order.customer && order.customer.altPhone) || order.altPhone) + '').slice(0, 10) || ''}</div>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: 220 }}>{(order.customer && order.customer.address) || order.address || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>{order.paymentType}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {order.items.map((item, i) => (
                          <li key={i} style={{ fontSize: 14 }}>{(item.name || item.item)} x {item.quantity || item.qty || 1}</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{calculateTotal(order.items)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '6px 10px', borderRadius: 20, background: order.status === 'Completed' ? '#d1fae5' : '#fff7ed', color: order.status === 'Completed' ? '#065f46' : '#92400e', fontWeight: 600 }}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        {order.status !== 'Completed' && (
                          <button onClick={() => markCompleted(origIndex)} style={{ background: '#10b981', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Mark Completed
                          </button>
                        )}

                        <button onClick={() => removeOrder(origIndex)} style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              });

              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerOrders;
