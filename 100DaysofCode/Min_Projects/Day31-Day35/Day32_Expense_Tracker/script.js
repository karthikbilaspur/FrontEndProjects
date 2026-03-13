// Constants
const API_URL = 'https://your-api-url.com/expenses';
const EXPENSES_STORAGE_KEY = 'expenses';
const PAGE_SIZE = 10;
const CATEGORY_COLORS = {
  Food: 'rgba(255, 99, 132, 0.2)',
  Transport: 'rgba(54, 162, 235, 0.2)',
  Entertainment: 'rgba(255, 206, 86, 0.2)',
  Other: 'rgba(75, 192, 192, 0.2)',
};
const CURRENCY_API_URL = 'https://api.currencyapi.com/v3/latest';
const CURRENCY_API_KEY = 'YOUR_CURRENCY_API_KEY';
const TRANSLATOR_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const TRANSLATOR_API_KEY = 'YOUR_TRANSLATOR_API_KEY';



// Expense Class
class Expense {
  constructor(name, amount, category, date) {
    this.name = name;
    this.amount = amount;
    this.category = category;
    this.date = date;
  }
}

// App
class App {
  constructor() {
    this.expenses = new Map();
    this.currentPage = 1;
    this.searchTimeout = null;
    this.chart = new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Expenses',
          data: [],
          backgroundColor: [],
        }],
      },
    });
    this.init();
  }

  async init() {
    await this.loadExpenses();
    this.displayPaginatedExpenses();
    this.addEventListeners();
    this.calculateStatistics();
  }

  async loadExpenses() {
    try {
      const response = await axios.get(API_URL);
      this.expenses = new Map(response.data.map((expense) => [expense.id, expense]));
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      try {
        const storedExpenses = JSON.parse(localStorage.getItem(EXPENSES_STORAGE_KEY));
        this.expenses = new Map(storedExpenses.map((expense) => [expense.id, expense]));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async saveExpenses() {
    try {
      await axios.post(API_URL, Array.from(this.expenses.values()));
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(Array.from(this.expenses.values())));
    } catch (error) {
      console.error(error);
    }
  }

  displayPaginatedExpenses(expenses = Array.from(this.expenses.values())) {
    const start = (this.currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paginatedExpenses = expenses.slice(start, end);
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    paginatedExpenses.forEach((expense, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
          <button class="edit-btn" data-index="${start + index}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-index="${start + index}"><i class="fas fa-trash"></i></button>
        </td>
      `;
      expenseList.appendChild(row);
    });
    this.updatePaginationControls(expenses.length);
  }

  updatePaginationControls(totalExpenses) {
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Page ${this.currentPage} of ${Math.ceil(totalExpenses / PAGE_SIZE)}`;
    const prevPageBtn = document.getElementById('prev-page-btn');
    prevPageBtn.disabled = this.currentPage === 1;
    const nextPageBtn = document.getElementById('next-page-btn');
    nextPageBtn.disabled = this.currentPage * PAGE_SIZE >= totalExpenses;
  }

  addEventListeners() {
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('expense-name').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const category = document.getElementById('expense-category').value;
      const date = document.getElementById('expense-date').value;
      const expense = new Expense(name, amount, category, date);
      this.expenses.set(Date.now(), expense);
      await this.saveExpenses();
      this.displayPaginatedExpenses();
      this.calculateStatistics();
      expenseForm.reset();
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        const searchText = searchInput.value.toLowerCase();
        const filteredExpenses = Array.from(this.expenses.values()).filter((expense) => {
          return (
            expense.name.toLowerCase().includes(searchText) ||
            expense.category.toLowerCase().includes(searchText)
          );
        });
        this.displayPaginatedExpenses(filteredExpenses);
      }, 500);
    });

    const prevPageBtn = document.getElementById('prev-page-btn');
    prevPageBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.displayPaginatedExpenses();
      }
    });

    const nextPageBtn = document.getElementById('next-page-btn');
    nextPageBtn.addEventListener('click', () => {
      if (this.currentPage * PAGE_SIZE < this.expenses.size) {
        this.currentPage++;
        this.displayPaginatedExpenses();
      }
    });
  }

  calculateStatistics() {
    const categoryWiseExpenses = {};
    this.expenses.forEach((expense) => {
      if (!categoryWiseExpenses[expense.category]) {
        categoryWiseExpenses[expense.category] = 0;
      }
      categoryWiseExpenses[expense.category] += expense.amount;
    });
    const labels = Object.keys(categoryWiseExpenses);
    const data = Object.values(categoryWiseExpenses);
    const backgroundColor = labels.map((label) => CATEGORY_COLORS[label]);
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = backgroundColor;
    this.chart.update();
  }

  exportExpenses() {
    const expensesJSON = JSON.stringify(Array.from(this.expenses.values()));
    const blob = new Blob([expensesJSON], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expenses.json';
    link.click();
  }

  importExpenses(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const expensesJSON = reader.result;
      const expenses = JSON.parse(expensesJSON);
      this.expenses = new Map(expenses.map((expense) => [expense.id, expense]));
      this.saveExpenses();
      this.displayPaginatedExpenses();
      this.calculateStatistics();
    };
    reader.readAsText(file);
  }
}

// Add event listeners
document.getElementById('add-expense-btn').addEventListener('click', () => {
  document.getElementById('expense-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('expense-modal').style.display = 'none';
});

document.getElementById('import-btn').addEventListener('click', () => {
  const file = document.getElementById('import-file').files[0];
  app.importExpenses({ target: { files: [file] } });
});

document.getElementById('export-btn').addEventListener('click', () => {
  app.exportExpenses();
});


// Function to fetch currency rates
function fetchCurrencyRates() {
  const apiUrl = `${CURRENCY_API_URL}?apikey=${CURRENCY_API_KEY}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;
      // Update your currency rates here
      console.log(rates);
    })
    .catch(error => console.error(error));
}

// Add language switcher event listener
document.getElementById('language-switcher').addEventListener('change', async (e) => {
  app.currentLanguage = e.target.value;
  await app.translateText('Expenses', app.currentLanguage);
  // Update your UI with translated text
  function updateUI(translatedText) {
    document.getElementById('app-title').textContent = translatedText;
  }
    updateUI(await app.translateText('Expenses', app.currentLanguage));  
});

const app = new App();