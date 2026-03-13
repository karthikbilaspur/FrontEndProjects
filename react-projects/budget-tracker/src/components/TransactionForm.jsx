// src/components/TransactionForm.jsx
import React, { useState, useEffect } from 'react';

function TransactionForm({ onSave, currentTransaction, allCategories, theme }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (currentTransaction) {
      setAmount(currentTransaction.amount);
      setDescription(currentTransaction.description);
      setType(currentTransaction.type);
      setCategory(currentTransaction.category);
      setDate(currentTransaction.date);
    } else {
      // Reset form for new transaction
      setAmount('');
      setDescription('');
      setType('expense');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
    }
  }, [currentTransaction]);

  useEffect(() => {
    // Set default category when allCategories loads if none is selected
    if (allCategories.length > 0 &&!category) {
        setCategory(allCategories[0].name);
    } else if (allCategories.length > 0 &&!allCategories.some(cat => cat.name === category)) {
        // If current category is not in allCategories (e.g., deleted), reset to first
        setCategory(allCategories[0].name);
    }
  }, [allCategories, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount ||!description.trim() ||!category ||!date) {
      alert('Please fill in all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    const newTransaction = {
      id: currentTransaction? currentTransaction.id : Date.now(),
      amount: parsedAmount,
      description: description.trim(),
      type,
      category,
      date,
      createdAt: currentTransaction? currentTransaction.createdAt : Date.now(),
    };

    onSave(newTransaction);
    // Clear form for new entry if not editing
    if (!currentTransaction) {
      setAmount('');
      setDescription('');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const getPlaceholder = (base, isDark) => isDark? `${base} (Dark Mode)` : base;

  return (
    <div className="card transaction-form-section">
      <h2>{currentTransaction? 'Edit Transaction' : 'Add New Transaction'}</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={getPlaceholder('Amount', theme === 'dark')}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {allCategories.filter(cat => cat.type === type).map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            {allCategories.filter(cat => cat.type === type).length === 0 && (
                <option value="">No categories for this type</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{gridColumn: 'span 2 / auto'}}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={getPlaceholder('Description', theme === 'dark')}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button-primary">
            {currentTransaction? 'Update Transaction' : 'Add Transaction'}
          </button>
          {currentTransaction && (
            <button type="button" onClick={() => onSave(null)}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;