import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const card = {
  background: '#fff',
  borderRadius: 8,
  padding: 12,
  boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
};

const MenuManagement = () => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState(() => {
    const raw = JSON.parse(localStorage.getItem('dailyMenu')) || [];
    return raw.map((it, i) => (it.id ? it : { ...it, id: Date.now() + i }));
  });
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('dailyMenu', JSON.stringify(menu));
    try {
      window.dispatchEvent(new CustomEvent('menuUpdated', { detail: menu }));
    } catch (e) {
      // fallback: dispatch a plain event
      window.dispatchEvent(new Event('menuUpdated'));
    }
  }, [menu]);

  const resetForm = () => setForm({ name: '', price: '', description: '' });

  const handleAddOrUpdate = () => {
    if (!form.name.trim()) return alert('Please enter item name');
    if (!form.price || Number(form.price) <= 0) return alert('Please enter valid price');

    const item = { id: Date.now() + Math.floor(Math.random() * 1000), name: form.name.trim(), price: Number(form.price), description: form.description || '', available: true };

    if (editingIndex >= 0) {
      const updated = [...menu];
      updated[editingIndex] = { ...updated[editingIndex], ...item };
      setMenu(updated);
      setEditingIndex(-1);
    } else {
      setMenu([...menu, item]);
    }

    resetForm();
  };

  const handleEdit = (idx) => {
    const it = menu[idx];
    setForm({ name: it.name, price: it.price, description: it.description || '' });
    setEditingIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Delete this menu item?')) return;
    const updated = menu.filter((_, i) => i !== idx);
    setMenu(updated);
  };

  const toggleAvailable = (idx) => {
    const updated = [...menu];
    updated[idx].available = !updated[idx].available;
    setMenu(updated);
  };

  const filtered = menu.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={() => navigate('/owner-dashboard')}
          style={{ background: '#ff7043', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        >
          ← Previous
        </button>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ flex: '0 0 420px', ...card }}>
          <h3 style={{ marginTop: 0, color: '#374151' }}>{editingIndex >= 0 ? 'Edit Menu Item' : 'Add Menu Item'}</h3>

          <label style={{ fontSize: 13, color: '#6b7280' }}>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #e5e7eb' }} />

          <label style={{ fontSize: 13, color: '#6b7280', marginTop: 10, display: 'block' }}>Price (₹)</label>
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #e5e7eb' }} />

          <label style={{ fontSize: 13, color: '#6b7280', marginTop: 10, display: 'block' }}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #e5e7eb' }} />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handleAddOrUpdate} style={{ flex: 1, padding: '10px 14px', background: '#ff7043', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {editingIndex >= 0 ? 'Update Item' : 'Add Item'}
            </button>
            <button onClick={() => { resetForm(); setEditingIndex(-1); }} style={{ padding: '10px 14px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#374151' }}>Daily Menu</h3>
            <input placeholder="Search items..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {filtered.length === 0 ? (
              <div style={{ ...card }}>No menu items found.</div>
            ) : filtered.map((it, idx) => (
              <div key={idx} style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{it.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{it.description}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#111827' }}>₹{it.price}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                  <div>
                    <button onClick={() => handleEdit(menu.indexOf(it))} style={{ marginRight: 8, padding: '8px 10px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(menu.indexOf(it))} style={{ padding: '8px 10px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Delete</button>
                  </div>
                  <div>
                    <button onClick={() => toggleAvailable(menu.indexOf(it))} style={{ padding: '8px 12px', borderRadius: 18, border: 'none', background: it.available ? '#10b981' : '#9ca3af', color: '#fff', cursor: 'pointer' }}>{it.available ? 'Available' : 'Hidden'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
