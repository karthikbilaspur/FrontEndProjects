// src/components/DashboardSummary.jsx
import React from 'react';

function DashboardSummary({ totalIncome, totalExpenses, balance, currentMonthYear }) {
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="summary-cards">
      <div className="card summary-card">
        <h3>Current Balance</h3>
        <p className="balance-text">{formatCurrency(balance)}</p>
      </div>
      <div className="card summary-card">
        <h3>Total Income ({currentMonthYear})</h3>
        <p className="income-text">{formatCurrency(totalIncome)}</p>
      </div>
      <div className="card summary-card">
        <h3>Total Expenses ({currentMonthYear})</h3>
        <p className="expense-text">{formatCurrency(totalExpenses)}</p>
      </div>
    </div>
  );
}

export default DashboardSummary;