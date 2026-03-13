// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardSummary from './components/DashboardSummary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import SpendingChart from './components/SpendingChart';
import './index.css';
import './App.css';

// Default categories
const defaultCategories = [
  { id: 1, name: 'Salary', type: 'income' },
  { id: 2, name: 'Groceries', type: 'expense' },
  { id: 3, name: 'Rent', type: 'expense' },
  { id: 4, name: 'Utilities', type: 'expense' },
  { id: 5, name: 'Transportation', type: 'expense' },
  { id: 6, name: 'Entertainment', type: 'expense' },
  { id: 7, name: 'Shopping', type: 'expense' },
  { id: 8, name: 'Freelance', type: 'income' },
];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Filters and Sorting
  const [filterMonth, setFilterMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' or specific category name
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'

  // Theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedCategories = localStorage.getItem('categories');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedCategories) setCategories(JSON.parse(savedCategories));

    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light'? 'dark' : 'light'));
  };

  // Transaction Actions
  const handleSaveTransaction = (transaction) => {
    if (currentTransaction) {
      setTransactions(transactions.map(t => (t.id === transaction.id? transaction : t)));
    } else {
      setTransactions([...transactions, transaction]);
    }
    setCurrentTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id!== id));
    }
  };

  // Category Actions
  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? All transactions in this category will become uncategorized.')) {
        // Remove category
        const updatedCategories = categories.filter(cat => cat.id!== id);
        setCategories(updatedCategories);

        // Update transactions that used this category to a default or empty string
        const categoryToDelete = categories.find(cat => cat.id === id);
        if (categoryToDelete) {
            setTransactions(prevTransactions =>
                prevTransactions.map(t =>
                    t.category === categoryToDelete.name? {...t, category: 'Uncategorized' } : t
                )
            );
        }
    }
  };

  // Filtered & Sorted Transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by Month
    if (filterMonth) {
      filtered = filtered.filter(t => t.date.startsWith(filterMonth));
    }

    // Filter by Type
    if (filterType!== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by Category
    if (filterCategory!== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let valA, valB;
      if (sortColumn === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortColumn === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else if (sortColumn === 'description' || sortColumn === 'category' || sortColumn === 'type') {
        valA = a[sortColumn].toLowerCase();
        valB = b[sortColumn].toLowerCase();
      } else {
          return 0; // No valid sort column
      }

      if (valA < valB) return sortDirection === 'asc'? -1 : 1;
      if (valA > valB) return sortDirection === 'asc'? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, filterMonth, filterType, filterCategory, sortColumn, sortDirection]);

  // Dashboard Calculations
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(filterMonth));
  }, [transactions, filterMonth]);

  const totalIncome = useMemo(() => {
    return currentMonthTransactions
     .filter(t => t.type === 'income')
     .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const totalExpenses = useMemo(() => {
    return currentMonthTransactions
     .filter(t => t.type === 'expense')
     .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const balance = useMemo(() => {
    return transactions.reduce((sum, t) => (t.type === 'income'? sum + t.amount : sum - t.amount), 0);
  }, [transactions]);

  const currentMonthYear = useMemo(() => {
    const [year, month] = filterMonth.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [filterMonth]);

  // Chart Data
  const expenseChartData = useMemo(() => {
    const categoryTotals = currentMonthTransactions
     .filter(t => t.type === 'expense')
     .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [currentMonthTransactions]);

  // Generate unique months for filter dropdown
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(t => {
      months.add(t.date.substring(0, 7)); // YYYY-MM format
    });
    const sortedMonths = Array.from(months).sort().reverse(); // Newest first
    return sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return {
        value: m,
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
      };
    });
  }, [transactions]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc'? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending for new sort column
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Budget Tracker</h1>
        <div className="controls">
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            {availableMonths.length > 0? (
                availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))
            ) : (
                <option value={filterMonth}>No Transactions</option>
            )}
          </select>
          <button className="button-secondary" onClick={toggleTheme}>
            {theme === 'light'? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </header>

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        currentMonthYear={currentMonthYear}
      />

      <TransactionForm
        onSave={handleSaveTransaction}
        currentTransaction={currentTransaction}
        allCategories={categories}
        theme={theme}
      />

      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        theme={theme}
      />

      <div className="transaction-list-section">
        <h2 style={{marginBottom: '20px'}}>Transactions</h2>
        <div className="card filters-sort">
            <div className="form-group">
                <label htmlFor="filterType">Filter by Type:</label>
                <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="filterCategory">Filter by Category:</label>
                <select id="filterCategory" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>
        </div>
        <TransactionList
          transactions={filteredAndSortedTransactions}
          onEdit={setCurrentTransaction}
          onDelete={handleDeleteTransaction}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      <div className="chart-section">
        <h2>Monthly Expense Breakdown</h2>
        <SpendingChart data={expenseChartData} />
      </div>
    </div>
  );
}

export default App;