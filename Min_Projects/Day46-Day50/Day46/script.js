// Constants
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const CURRENCY = 'USD';
const API_URL = 'https://example.com/api/transactions';

// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const typeEl = document.getElementById("type");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter");
const chartEl = document.getElementById("expense-chart");
const categoryEl = document.getElementById("category");
const sortEl = document.getElementById("sort");

// State
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let accounts = JSON.parse(localStorage.getItem("accounts")) || [{ name: "Default Account", id: 1 }];
let currentAccount = accounts[0];
let categories = ['Food', 'Transportation', 'Entertainment', 'Rent', 'Utilities'];
let sortOrder = 'newest';

// Event Listeners
transactionFormEl.addEventListener("submit", addTransaction);
searchEl.addEventListener("input", searchTransactions);
filterEl.addEventListener("change", filterTransactions);
sortEl.addEventListener("change", (e) => {
  sortOrder = e.target.value;
  updateUI();
});

// Functions
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function validateTransaction(description, amount) {
  if (!description || !amount) {
    throw new Error('Description and amount are required');
  }
  if (isNaN(amount)) {
    throw new Error('Invalid amount');
  }
}

async function createTransaction(transaction) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
}

async function getTransactions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}

function updateUI() {
  updateTransactionList();
  updateSummary();
  updateChart();
}

async function addTransaction(e) {
  e.preventDefault();

  try {
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;
    const category = categoryEl.value;

    validateTransaction(description, amount);

    if (type === TRANSACTION_TYPES.INCOME && amount <= 0) {
      throw new Error('Please enter a positive amount for income');
    }

    if (type === TRANSACTION_TYPES.EXPENSE && amount >= 0) {
      throw new Error('Please enter a negative amount for expense');
    }

    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      accountId: currentAccount.id,
      date: new Date(),
    };

    const data = await createTransaction(transaction);
    transactions.push(data);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateUI();
    transactionFormEl.reset();
  } catch (error) {
    console.error(error.message);
  }
}

function removeTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateUI();
  }
}

function updateTransactionList(transactionsToShow = transactions) {
  transactionListEl.innerHTML = "";

  const filteredTransactions = transactionsToShow.filter((transaction) => transaction.accountId === currentAccount.id);

  const sortedTransactions = sortTransactions(filteredTransactions);

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.type);

  const descriptionSpan = document.createElement("span");
  descriptionSpan.textContent = transaction.description;

  const amountSpan = document.createElement("span");
  amountSpan.textContent = formatCurrency(transaction.amount);

  const categorySpan = document.createElement("span");
  categorySpan.textContent = transaction.category;

  const dateSpan = document.createElement("span");
  dateSpan.textContent = new Date(transaction.date).toLocaleDateString();

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "x";
  deleteBtn.addEventListener("click", () => removeTransaction(transaction.id));

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTransaction(transaction.id));

  li.appendChild(descriptionSpan);
  li.appendChild(amountSpan);
  li.appendChild(categorySpan);
  li.appendChild(dateSpan);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);

  return li;
}

function updateSummary() {
  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.accountId === currentAccount.id) {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);

  const income = transactions
    .filter((transaction) => transaction.type === TRANSACTION_TYPES.INCOME && transaction.accountId === currentAccount.id)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE && transaction.accountId === currentAccount.id)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(number);
}

function searchTransactions() {
  const query = searchEl.value.trim().toLowerCase();
  const filteredTransactions = transactions.filter((transaction) => {
    return transaction.description.toLowerCase().includes(query) && transaction.accountId === currentAccount.id;
  });

  updateTransactionList(filteredTransactions);
}

function filterTransactions() {
  const type = filterEl.value;
  const filteredTransactions = transactions.filter((transaction) => {
    if (type === "all") {
      return transaction.accountId === currentAccount.id;
    }
    return transaction.type === type && transaction.accountId === currentAccount.id;
  });

  updateTransactionList(filteredTransactions);
}

function sortTransactions(transactionsToSort = transactions) {
  if (sortOrder === 'newest') {
    return transactionsToSort.sort((a, b) => b.date - a.date);
  } else if (sortOrder === 'oldest') {
    return transactionsToSort.sort((a, b) => a.date - b.date);
  } else if (sortOrder === 'amountHigh') {
    return transactionsToSort.sort((a, b) => b.amount - a.amount);
  } else if (sortOrder === 'amountLow') {
    return transactionsToSort.sort((a, b) => a.amount - b.amount);
  }
}

function updateChart() {
  try {
    const ctx = chartEl.getContext("2d");
    const labels = ["Income", "Expenses"];
    const data = [
      transactions
        .filter((transaction) => transaction.type === TRANSACTION_TYPES.INCOME && transaction.accountId === currentAccount.id)
        .reduce((acc, transaction) => acc + transaction.amount, 0),
      transactions
        .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE && transaction.accountId === currentAccount.id)
        .reduce((acc, transaction) => acc + transaction.amount, 0),
    ];

    new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Transactions",
            data,
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error updating chart:', error);
  }
}

function editTransaction(id) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  const newDescription = prompt("Enter new description", transaction.description);
  const newAmount = parseFloat(prompt("Enter new amount", transaction.amount));

  if (newDescription && isValidNumber(newAmount)) {
    transaction.description = newDescription;
    transaction.amount = newAmount;

    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateUI();
  }
}

// Initial render
updateUI();