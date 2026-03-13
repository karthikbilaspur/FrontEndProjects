// src/components/CategoryManager.jsx
import React, { useState } from 'react';

function CategoryManager({ categories, onAddCategory, onDeleteCategory, theme }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
        alert('Category already exists.');
        return;
    }
    onAddCategory({
      id: Date.now(),
      name: newCategoryName.trim(),
      type: newCategoryType,
    });
    setNewCategoryName('');
  };

  const getPlaceholder = (base, isDark) => isDark? `${base} (Dark Mode)` : base;

  return (
    <div className="card category-management">
      <h2>Manage Categories</h2>
      <div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={getPlaceholder('New Category Name', theme === 'dark')}
            style={{ flexGrow: 1, minWidth: '150px' }}
          />
          <select value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button onClick={handleAddCategory} className="button-primary">Add Category</button>
        </div>
      </div>

      <h3>Existing Categories:</h3>
      <div className="category-list">
        {categories.length === 0 && <p className="empty-state">No custom categories yet.</p>}
        {categories.map((cat) => (
          <span key={cat.id} className="category-tag">
            {cat.name} ({cat.type})
            <button onClick={() => onDeleteCategory(cat.id)} className="delete-btn">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;