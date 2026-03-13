// src/components/TransactionList.jsx
import React, { useState } from 'react';

function TransactionList({ transactions, onEdit, onDelete, sortColumn, sortDirection, onSort }) {
  if (transactions.length === 0) {
    return <div className="empty-state">No transactions found for the selected period/filters.</div>;
  }

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getSortClass = (column) => {
    if (sortColumn === column) {
      return `sorted ${sortDirection}`;
    }
    return '';
  };

  return (
    <div className="card">
      <table className="transaction-table">
        <thead>
          <tr>
            <th className={getSortClass('date')} onClick={() => onSort('date')}>Date</th>
            <th className={getSortClass('description')} onClick={() => onSort('description')}>Description</th>
            <th className={getSortClass('category')} onClick={() => onSort('category')}>Category</th>
            <th className={getSortClass('type')} onClick={() => onSort('type')}>Type</th>
            <th className={getSortClass('amount')} onClick={() => onSort('amount')}>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td data-label="Date">{formatDate(transaction.date)}</td>
              <td data-label="Description">{transaction.description}</td>
              <td data-label="Category">{transaction.category}</td>
              <td data-label="Type" className={transaction.type === 'income'? 'income-text' : 'expense-text'}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </td>
              <td data-label="Amount" className={transaction.type === 'income'? 'income-text' : 'expense-text'}>
                {transaction.type === 'expense' && '-'}
                {formatCurrency(transaction.amount)}
              </td>
              <td data-label="Actions" className="transaction-actions">
                <button onClick={() => onEdit(transaction)}>Edit</button>
                <button className="button-danger" onClick={() => onDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;