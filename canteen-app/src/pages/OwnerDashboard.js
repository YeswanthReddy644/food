import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import OwnerOrders from './OwnerOrders';

const cardStyle = {
  background: '#fff',
  borderRadius: 10,
  padding: '18px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
};

const OwnerDashboard = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [menuCount, setMenuCount] = useState(0);
  const [viewMode, setViewMode] = useState('all'); // all | pending | completed | menu
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    const updateCounts = () => {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrdersCount(orders.length);
      setPendingCount(orders.filter((o) => { const s = ((o.status || 'Pending') + '').trim().toLowerCase(); return s === 'pending'; }).length);
      setCompletedCount(orders.filter((o) => { const s = ((o.status || '') + '').trim().toLowerCase(); return s === 'completed'; }).length);
      // read dailyMenu as the source of truth for menu items and count only available items
      const menu = JSON.parse(localStorage.getItem('dailyMenu') || '[]') || [];
      const visible = (menu || []).filter((m) => (m.available === undefined ? true : m.available));
      setMenuCount(visible.length);
    };

    updateCounts();

    window.addEventListener('ordersUpdated', updateCounts);
    window.addEventListener('menuUpdated', updateCounts);
    return () => {
      window.removeEventListener('ordersUpdated', updateCounts);
      window.removeEventListener('menuUpdated', updateCounts);
    };
  }, []);

  const ordersRef = useRef(null);

  const showAndScroll = (mode) => {
    setViewMode(mode);
    // small timeout to wait for render then scroll orders into view
    setTimeout(() => {
      if (ordersRef.current) ordersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div style={{ padding: 24, background: '#f7f6f4', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, color: '#374151' }}>Owner Dashboard</h1>
          <div style={{ color: '#6b7280', marginTop: 6 }}>
            Welcome{currentUser && currentUser.name ? `, ${currentUser.name}` : ''} — manage your canteen and orders here.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/owner-dashboard/menu-management" style={{ ...cardStyle, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#374151' }}>
            <strong>Manage Menu</strong>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 22 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => showAndScroll('all')}
          onKeyDown={(e) => e.key === 'Enter' && showAndScroll('all')}
          style={{ ...cardStyle, cursor: 'pointer', border: viewMode === 'all' ? '2px solid #3b82f6' : undefined }}
        >
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{ordersCount}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => showAndScroll('pending')}
          onKeyDown={(e) => e.key === 'Enter' && showAndScroll('pending')}
          style={{ ...cardStyle, cursor: 'pointer', border: viewMode === 'pending' ? '2px solid #f59e0b' : undefined }}
        >
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Pending</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => showAndScroll('completed')}
          onKeyDown={(e) => e.key === 'Enter' && showAndScroll('completed')}
          style={{ ...cardStyle, cursor: 'pointer', border: viewMode === 'completed' ? '2px solid #10b981' : undefined }}
        >
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Completed</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{completedCount}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => showAndScroll('menu')}
          onKeyDown={(e) => e.key === 'Enter' && showAndScroll('menu')}
          style={{ ...cardStyle, cursor: 'pointer', border: viewMode === 'menu' ? '2px solid #111827' : undefined }}
        >
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Menu Items</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{menuCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
        <div style={{ ...cardStyle }} ref={ordersRef}>
          {viewMode === 'menu' ? (
            <div>
              <h2 style={{ marginTop: 0 }}>Menu Items</h2>
              <div>
                {(JSON.parse(localStorage.getItem('dailyMenu') || '[]') || []).length === 0 ? (
                  <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>No menu items.</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(JSON.parse(localStorage.getItem('dailyMenu') || '[]') || []).map((m, i) => (
                      <li key={m.id || i} style={{ padding: '8px 0' }}>
                        <strong>{m.name}</strong>{m.description ? ` — ${m.description}` : ''} <span style={{ color: '#6b7280' }}>₹{m.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <OwnerOrders filter={viewMode} />
          )}
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
