import React, { useState } from 'react';

const MenuCard = ({ item, onSelect }) => {
  const [quantity, setQuantity] = useState(1);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  const handleAdd = (e) => {
    e.stopPropagation();
    onSelect({ ...item, quantity });
  };

  return (
    <div className={`menu-card`}>
      {item.image && (
        <div className="card-media">
          <img src={item.image} alt={item.name} />
        </div>
      )}

      <div className="card-body">
        <h3 className="item-name">{item.name}</h3>
        {item.description && <p className="item-desc">{item.description}</p>}

        <div className="card-meta">
          <div className="price">₹{item.price}</div>

          <div className="qty-controls" aria-label="quantity">
            <button type="button" className="qty-btn" onClick={dec}>−</button>
            <input
              className="qty-input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
            <button type="button" className="qty-btn" onClick={inc}>+</button>
          </div>
        </div>

        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

export default MenuCard;
