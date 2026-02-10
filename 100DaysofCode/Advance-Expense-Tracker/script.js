// Constants
// In a real application, API_URLs and API_KEYs would be handled on a secure backend
const API_URL = 'https://your-api-url.com/expenses'; // Placeholder
const EXPENSES_STORAGE_KEY = 'expenses';
const PAGE_SIZE = 10;
const CATEGORY_COLORS = {
  Food: 'rgba(255, 99, 132, 0.6)',
  Transport: 'rgba(54, 162, 235, 0.6)',
  Entertainment: 'rgba(255, 206, 86, 0.6)',
  Other: 'rgba(75, 192, 192, 0.6)',
  // Add more categories if needed
};

// Mock currency rates and symbols (replace with actual API calls through a backend)
const MOCK_CURRENCY_RATES = {
    "INR": 1,
    "USD": 0.012, // 1 INR = 0.012 USD
    "EUR": 0.011, // 1 INR = 0.011 EUR
};
const CURRENCY_SYMBOLS = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€",
};

// Mock translation dictionary (replace with actual API calls through a backend)
const MOCK_TRANSLATIONS = {
    "en": {
        "Expense Tracker": "Expense Tracker",
        "Add Expense": "Add Expense",
        "Search expenses...": "Search expenses...",
        "Name": "Name",
        "Amount": "Amount",
        "Category": "Category",
        "Date": "Date",
        "Actions": "Actions",
        "Prev": "Prev",
        "Next": "Next",
        "Page {currentPage} of {totalPages}": "Page {currentPage} of {totalPages}",
        "Import": "Import",
        "Export": "Export",
        "Add Expense Modal": "Add Expense",
        "Edit Expense Modal": "Edit Expense",
        "Expense Name": "Expense Name",
        "Select Category": "Select Category",
        "Save": "Save",
        "All": "All",
        "Food": "Food",
        "Transport": "Transport",
        "Entertainment": "Entertainment",
        "Other": "Other",
        "Expense added successfully!": "Expense added successfully!",
        "Expense updated successfully!": "Expense updated successfully!",
        "Expense deleted successfully!": "Expense deleted successfully!",
        "Error loading expenses.": "Error loading expenses.",
        "Error saving expenses.": "Error saving expenses.",
        "Error deleting expense.": "Error deleting expense.",
        "Error importing expenses.": "Error importing expenses.",
        "Error exporting expenses.": "Error exporting expenses.",
        "Error fetching currency rates.": "Error fetching currency rates.",
        "Error translating text.": "Error translating text.",
    },
    "hi": {
        "Expense Tracker": "खर्च ट्रैकर",
        "Add Expense": "खर्च जोड़ें",
        "Search expenses...": "खर्च खोजें...",
        "Name": "नाम",
        "Amount": "राशि",
        "Category": "श्रेणी",
        "Date": "दिनांक",
        "Actions": "कार्य",
        "Prev": "पिछला",
        "Next": "अगला",
        "Page {currentPage} of {totalPages}": "पृष्ठ {currentPage} का {totalPages}",
        "Import": "आयात करें",
        "Export": "निर्यात करें",
        "Add Expense Modal": "खर्च जोड़ें",
        "Edit Expense Modal": "खर्च संपादित करें",
        "Expense Name": "खर्च का नाम",
        "Select Category": "श्रेणी चुनें",
        "Save": "सहेजें",
        "All": "सभी",
        "Food": "भोजन",
        "Transport": "परिवहन",
        "Entertainment": "मनोरंजन",
        "Other": "अन्य",
        "Expense added successfully!": "खर्च सफलतापूर्वक जोड़ा गया!",
        "Expense updated successfully!": "खर्च सफलतापूर्वक अपडेट किया गया!",
        "Expense deleted successfully!": "खर्च सफलतापूर्वक हटाया गया!",
        "Error loading expenses.": "खर्च लोड करने में त्रुटि।",
        "Error saving expenses.": "खर्च सहेजने में त्रुटि।",
        "Error deleting expense.": "खर्च हटाने में त्रुटि।",
        "Error importing expenses.": "खर्च आयात करने में त्रुटि।",
        "Error exporting expenses.": "खर्च निर्यात करने में त्रुटि।",
        "Error fetching currency rates.": "मुद्रा दरें प्राप्त करने में त्रुटि।",
        "Error translating text.": "पाठ का अनुवाद करने में त्रुटि।",
    },
    "es": {
        "Expense Tracker": "Rastreador de Gastos",
        "Add Expense": "Añadir Gasto",
        "Search expenses...": "Buscar gastos...",
        "Name": "Nombre",
        "Amount": "Cantidad",
        "Category": "Categoría",
        "Date": "Fecha",
        "Actions": "Acciones",
        "Prev": "Anterior",
        "Next": "Siguiente",
        "Page {currentPage} of {totalPages}": "Página {currentPage} de {totalPages}",
        "Import": "Importar",
        "Export": "Exportar",
        "Add Expense Modal": "Añadir Gasto",
        "Edit Expense Modal": "Editar Gasto",
        "Expense Name": "Nombre del Gasto",
        "Select Category": "Seleccionar Categoría",
        "Save": "Guardar",
        "All": "Todos",
        "Food": "Comida",
        "Transport": "Transporte",
        "Entertainment": "Entretenimiento",
        "Other": "Otro",
        "Expense added successfully!": "¡Gasto añadido con éxito!",
        "Expense updated successfully!": "¡Gasto actualizado con éxito!",
        "Expense deleted successfully!": "¡Gasto eliminado con éxito!",
        "Error loading expenses.": "Error al cargar gastos.",
        "Error saving expenses.": "Error al guardar gastos.",
        "Error deleting expense.": "Error al eliminar gasto.",
        "Error importing expenses.": "Error al importar gastos.",
        "Error exporting expenses.": "Error al exportar gastos.",
        "Error fetching currency rates.": "Error al obtener tasas de cambio.",
        "Error translating text.": "Error al traducir texto."
    },
    "zh": {
        "Expense Tracker": "费用追踪器",
        "Add Expense": "添加费用",
        "Search expenses...": "搜索费用...",
        "Name": "名称",
        "Amount": "金额",
        "Category": "类别",
        "Date": "日期",
        "Actions": "操作",
        "Prev": "上一页",
        "Next": "下一页",
        "Page {currentPage} of {totalPages}": "第 {currentPage} 页 / 共 {totalPages} 页",
        "Import": "导入",
        "Export": "导出",
        "Add Expense Modal": "添加费用",
        "Edit Expense Modal": "编辑费用",
        "Expense Name": "费用名称",
        "Select Category": "选择类别",
        "Save": "保存",
        "All": "全部",
        "Food": "餐饮",
        "Transport": "交通",
        "Entertainment": "娱乐",
        "Other": "其他",
        "Expense added successfully!": "费用添加成功！",
        "Expense updated successfully!": "费用更新成功！",
        "Expense deleted successfully!": "费用删除成功！",
        "Error loading expenses.": "加载费用时出错。",
        "Error saving expenses.": "保存费用时出错。",
        "Error deleting expense.": "删除费用时出错。",
        "Error importing expenses.": "导入费用时出错。",
        "Error exporting expenses.": "导出费用时出错。",
        "Error fetching currency rates.": "获取汇率时出错。",
        "Error translating text.": "翻译文本时出错。"
    },
    "ru": {
        "Expense Tracker": "Отслеживание расходов",
        "Add Expense": "Добавить расход",
        "Search expenses...": "Поиск расходов...",
        "Name": "Название",
        "Amount": "Сумма",
        "Category": "Категория",
        "Date": "Дата",
        "Actions": "Действия",
        "Prev": "Пред.",
        "Next": "След.",
        "Page {currentPage} of {totalPages}": "Страница {currentPage} из {totalPages}",
        "Import": "Импорт",
        "Export": "Экспорт",
        "Add Expense Modal": "Добавить расход",
        "Edit Expense Modal": "Редактировать расход",
        "Expense Name": "Название расхода",
        "Select Category": "Выберите категорию",
        "Save": "Сохранить",
        "All": "Все",
        "Food": "Еда",
        "Transport": "Транспорт",
        "Entertainment": "Развлечения",
        "Other": "Прочее",
        "Expense added successfully!": "Расход успешно добавлен!",
        "Expense updated successfully!": "Расход успешно обновлен!",
        "Expense deleted successfully!": "Расход успешно удален!",
        "Error loading expenses.": "Ошибка загрузки расходов.",
        "Error saving expenses.": "Ошибка сохранения расходов.",
        "Error deleting expense.": "Ошибка удаления расхода.",
        "Error importing expenses.": "Ошибка импорта расходов.",
        "Error exporting expenses.": "Ошибка экспорта расходов.",
        "Error fetching currency rates.": "Ошибка получения курсов валют.",
        "Error translating text.": "Ошибка перевода текста."
    },
    "ja": {
        "Expense Tracker": "経費トラッカー",
        "Add Expense": "経費を追加",
        "Search expenses...": "経費を検索...",
        "Name": "名前",
        "Amount": "金額",
        "Category": "カテゴリ",
        "Date": "日付",
        "Actions": "アクション",
        "Prev": "前へ",
        "Next": "次へ",
        "Page {currentPage} of {totalPages}": "{totalPages}ページ中{currentPage}ページ",
        "Import": "インポート",
        "Export": "エクスポート",
        "Add Expense Modal": "経費を追加",
        "Edit Expense Modal": "経費を編集",
        "Expense Name": "経費名",
        "Select Category": "カテゴリを選択",
        "Save": "保存",
        "All": "すべて",
        "Food": "食費",
        "Transport": "交通費",
        "Entertainment": "娯楽費",
        "Other": "その他",
        "Expense added successfully!": "経費が正常に追加されました！",
        "Expense updated successfully!": "経費が正常に更新されました！",
        "Expense deleted successfully!": "経費が正常に削除されました！",
        "Error loading expenses.": "経費の読み込みエラー。",
        "Error saving expenses.": "経費の保存エラー。",
        "Error deleting expense.": "経費の削除エラー。",
        "Error importing expenses.": "経費のインポートエラー。",
        "Error exporting expenses.": "経費のエクスポートエラー。",
        "Error fetching currency rates.": "通貨レートの取得エラー。",
        "Error translating text.": "テキストの翻訳エラー。"
    },
    "ar": {
        "Expense Tracker": "متتبع المصاريف",
        "Add Expense": "إضافة مصاريف",
        "Search expenses...": "بحث في المصاريف...",
        "Name": "الاسم",
        "Amount": "المبلغ",
        "Category": "الفئة",
        "Date": "التاريخ",
        "Actions": "الإجراءات",
        "Prev": "السابق",
        "Next": "التالي",
        "Page {currentPage} of {totalPages}": "صفحة {currentPage} من {totalPages}",
        "Import": "استيراد",
        "Export": "تصدير",
        "Add Expense Modal": "إضافة مصاريف",
        "Edit Expense Modal": "تعديل المصاريف",
        "Expense Name": "اسم المصروف",
        "Select Category": "اختر الفئة",
        "Save": "حفظ",
        "All": "الكل",
        "Food": "طعام",
        "Transport": "مواصلات",
        "Entertainment": "ترفيه",
        "Other": "أخرى",
        "Expense added successfully!": "تمت إضافة المصروف بنجاح!",
        "Expense updated successfully!": "تم تحديث المصروف بنجاح!",
        "Expense deleted successfully!": "تم حذف المصروف بنجاح!",
        "Error loading expenses.": "خطأ في تحميل المصاريف.",
        "Error saving expenses.": "خطأ في حفظ المصاريف.",
        "Error deleting expense.": "خطأ في حذف المصروف.",
        "Error importing expenses.": "خطأ في استيراد المصاريف.",
        "Error exporting expenses.": "خطأ في تصدير المصاريف.",
        "Error fetching currency rates.": "خطأ في جلب أسعار العملات.",
        "Error translating text.": "خطأ في ترجمة النص."
    }
};
// Helper for generating unique IDs (simple UUID v4 like)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x'? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Expense Class
class Expense {
  constructor(id, name, amount, category, date) {
    this.id = id || generateUUID(); // Assign ID or generate new
    this.name = name;
    this.amount = parseFloat(amount); // Ensure amount is a number
    this.category = category;
    this.date = date;
  }
}

// App
class App {
  constructor() {
    this.expenses = new Map(); // Map to store expenses with ID as key
    this.currentPage = 1;
    this.searchTimeout = null;
    this.currentFilterCategory = 'All';
    this.currentSearchText = '';
    this.currentCurrency = 'INR';
    this.currentLanguage = 'en';
    this.currencyRates = MOCK_CURRENCY_RATES; // Initialize with mock rates
    this.chart = new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Total Expenses by Category',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount'
            }
          },
          x: {
              title: {
                  display: true,
                  text: 'Category'
              }
          }
        },
        plugins: {
            legend: {
                display: false // No need for legend as labels are clear
            },
            title: {
                display: true,
                text: 'Category-wise Expense Distribution'
            }
        }
      }
    });
    this.init();
  }

  async init() {
    // await this.fetchCurrencyRates(); // In a real app, you'd fetch these
    this.loadLanguageAndCurrencySettings();
    await this.loadExpenses();
    this.applyFiltersAndSearch(); // Initial display
    this.addEventListeners();
    this.calculateStatistics();
    this.translateUI(); // Translate initial UI
  }

  // --- API / Storage Operations ---
  async loadExpenses() {
    try {
      // In a real app, this would be an API call:
      // const response = await axios.get(API_URL);
      // const data = response.data;
      // For now, load from localStorage
      const storedExpenses = JSON.parse(localStorage.getItem(EXPENSES_STORAGE_KEY) || '[]');
      this.expenses = new Map(storedExpenses.map((expense) => [expense.id, new Expense(expense.id, expense.name, expense.amount, expense.category, expense.date)]));
      this.showAlert('success', this.getTranslation("Expenses loaded successfully!"));
    } catch (error) {
      console.error('Error loading expenses:', error);
      this.showAlert('error', this.getTranslation("Error loading expenses."));
    }
  }

  async saveExpenses() {
    try {
      const expensesArray = Array.from(this.expenses.values());
      // In a real app, this would be an API call:
      // await axios.post(API_URL, expensesArray);
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expensesArray));
      this.showAlert('success', this.getTranslation("Expenses saved successfully!"));
    } catch (error) {
      console.error('Error saving expenses:', error);
      this.showAlert('error', this.getTranslation("Error saving expenses."));
    }
  }

  async addExpense(expense) {
      try {
          // In a real app, this would be an API call:
          // const response = await axios.post(API_URL, expense);
          // this.expenses.set(response.data.id, new Expense(...response.data)); // Use ID from API
          this.expenses.set(expense.id, expense);
          await this.saveExpenses();
          this.applyFiltersAndSearch();
          this.calculateStatistics();
          this.showAlert('success', this.getTranslation("Expense added successfully!"));
      } catch (error) {
          console.error('Error adding expense:', error);
          this.showAlert('error', this.getTranslation("Error saving expenses."));
      }
  }

  async updateExpense(id, updatedExpenseData) {
      try {
          // In a real app, this would be an API call:
          // const response = await axios.put(`${API_URL}/${id}`, updatedExpenseData);
          this.expenses.set(id, new Expense(id, updatedExpenseData.name, updatedExpenseData.amount, updatedExpenseData.category, updatedExpenseData.date));
          await this.saveExpenses();
          this.applyFiltersAndSearch();
          this.calculateStatistics();
          this.showAlert('success', this.getTranslation("Expense updated successfully!"));
      } catch (error) {
          console.error('Error updating expense:', error);
          this.showAlert('error', this.getTranslation("Error saving expenses."));
      }
  }

  async deleteExpense(id) {
      try {
          // In a real app, this would be an API call:
          // await axios.delete(`${API_URL}/${id}`);
          this.expenses.delete(id);
          await this.saveExpenses();
          this.applyFiltersAndSearch();
          this.calculateStatistics();
          this.showAlert('success', this.getTranslation("Expense deleted successfully!"));
      } catch (error) {
          console.error('Error deleting expense:', error);
          this.showAlert('error', this.getTranslation("Error deleting expense."));
      }
  }

  // --- Display & UI Updates ---
  displayPaginatedExpenses(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const start = (this.currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paginatedExpenses = expenses.slice(start, end);

    const currencySymbol = CURRENCY_SYMBOLS[this.currentCurrency] || '';
    const baseRate = this.currencyRates['INR'] || 1; // Assuming INR is the base for storage
    const targetRate = this.currencyRates[this.currentCurrency] || 1;

    paginatedExpenses.forEach((expense) => {
      const row = document.createElement('tr');
      // Convert amount for display
      const convertedAmount = (expense.amount / baseRate) * targetRate;
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${currencySymbol}${convertedAmount.toFixed(2)}</td>
        <td>${this.getTranslation(expense.category)}</td>
        <td>${expense.date}</td>
        <td>
          <button class="edit-btn" data-id="${expense.id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${expense.id}"><i class="fas fa-trash"></i></button>
        </td>
      `;
      expenseList.appendChild(row);
    });
    this.updatePaginationControls(expenses.length);
  }

  updatePaginationControls(totalExpenses) {
    const pageInfo = document.getElementById('page-info');
    const totalPages = Math.ceil(totalExpenses / PAGE_SIZE);
    pageInfo.textContent = this.getTranslation("Page {currentPage} of {totalPages}")
                               .replace('{currentPage}', this.currentPage)
                               .replace('{totalPages}', totalPages);

    const prevPageBtn = document.getElementById('prev-page-btn');
    prevPageBtn.disabled = this.currentPage === 1;
    const nextPageBtn = document.getElementById('next-page-btn');
    nextPageBtn.disabled = this.currentPage * PAGE_SIZE >= totalExpenses;
  }

  // --- Event Listeners ---
  addEventListeners() {
    // Add/Edit Expense Modal
    document.getElementById('add-expense-btn').addEventListener('click', () => this.openExpenseModal());
    document.querySelector('.close').addEventListener('click', () => this.closeExpenseModal());
    window.addEventListener('click', (event) => {
      if (event.target == document.getElementById('expense-modal')) {
        this.closeExpenseModal();
      }
    });

    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('expense-id').value;
      const name = document.getElementById('expense-name').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const category = document.getElementById('expense-category').value;
      const date = document.getElementById('expense-date').value;

      if (id) { // Editing existing expense
          await this.updateExpense(id, { name, amount, category, date });
      } else { // Adding new expense
          const newExpense = new Expense(null, name, amount, category, date);
          await this.addExpense(newExpense);
      }
      this.closeExpenseModal();
      expenseForm.reset();
    });

    // Search and Filter
    document.getElementById('searchInput').addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.currentSearchText = e.target.value.toLowerCase();
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1; // Reset to first page on new search/filter
        this.applyFiltersAndSearch();
      }, 300); // Debounce search input
    });

    document.getElementById('filter-category').addEventListener('change', (e) => {
      this.currentFilterCategory = e.target.value;
      this.currentPage = 1; // Reset to first page on new search/filter
      this.applyFiltersAndSearch();
    });

    // Pagination
    document.getElementById('prev-page-btn').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.applyFiltersAndSearch();
      }
    });
    document.getElementById('next-page-btn').addEventListener('click', () => {
      if (this.currentPage * PAGE_SIZE < this.getFilteredAndSearchedExpenses().length) {
        this.currentPage++;
        this.applyFiltersAndSearch();
      }
    });

    // Edit and Delete buttons (delegated event listeners)
    document.getElementById('expense-list').addEventListener('click', async (e) => {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            this.editExpense(id);
        } else if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            if (confirm(this.getTranslation("Are you sure you want to delete this expense?"))) {
                await this.deleteExpense(id);
            }
        }
    });

    // Import/Export
    document.getElementById('import-btn').addEventListener('click', () => {
      document.getElementById('import-file').click(); // Trigger file input click
    });
    document.getElementById('import-file').addEventListener('change', (event) => this.importExpenses(event));
    document.getElementById('export-btn').addEventListener('click', () => this.exportExpenses());

    // Language and Currency Switchers
    document.getElementById('language-switcher').addEventListener('change', (e) => {
        this.currentLanguage = e.target.value;
        this.saveLanguageAndCurrencySettings();
        this.translateUI();
        this.applyFiltersAndSearch(); // Refresh list to translate categories
        this.calculateStatistics(); // Recalculate chart for translated labels
    });
    document.getElementById('currency-switcher').addEventListener('change', (e) => {
        this.currentCurrency = e.target.value;
        this.saveLanguageAndCurrencySettings();
        this.applyFiltersAndSearch(); // Refresh list to show new currency
        this.calculateStatistics(); // Recalculate chart with new currency labels
    });
  }

  // --- Filtering and Searching ---
  getFilteredAndSearchedExpenses() {
    let filteredExpenses = Array.from(this.expenses.values());

    // Apply category filter
    if (this.currentFilterCategory!== 'All') {
        filteredExpenses = filteredExpenses.filter(expense =>
            expense.category === this.currentFilterCategory
        );
    }

    // Apply search filter
    if (this.currentSearchText) {
        filteredExpenses = filteredExpenses.filter(expense =>
            expense.name.toLowerCase().includes(this.currentSearchText) ||
            expense.category.toLowerCase().includes(this.currentSearchText) ||
            expense.date.includes(this.currentSearchText) // Allow searching by date
        );
    }
    return filteredExpenses;
  }

  applyFiltersAndSearch() {
    const expensesToDisplay = this.getFilteredAndSearchedExpenses();
    this.displayPaginatedExpenses(expensesToDisplay);
  }

  // --- Modal Operations ---
  openExpenseModal(expense = null) {
    const modal = document.getElementById('expense-modal');
    const modalTitle = document.getElementById('modal-title');
    const expenseForm = document.getElementById('expense-form');

    expenseForm.reset(); // Clear previous form data

    if (expense) {
      document.getElementById('expense-id').value = expense.id;
      document.getElementById('expense-name').value = expense.name;
      document.getElementById('expense-amount').value = expense.amount;
      document.getElementById('expense-category').value = expense.category;
      document.getElementById('expense-date').value = expense.date;
      modalTitle.textContent = this.getTranslation("Edit Expense Modal");
    } else {
      document.getElementById('expense-id').value = ''; // Clear ID for new expense
      modalTitle.textContent = this.getTranslation("Add Expense Modal");
    }
    modal.style.display = 'block';
  }

  closeExpenseModal() {
    document.getElementById('expense-modal').style.display = 'none';
  }

  editExpense(id) {
    const expense = this.expenses.get(id);
    if (expense) {
      this.openExpenseModal(expense);
    }
  }

  // --- Statistics and Chart ---
  calculateStatistics() {
    const categoryWiseExpenses = {};
    const currencySymbol = CURRENCY_SYMBOLS[this.currentCurrency] || '';
    const baseRate = this.currencyRates['INR'] || 1;
    const targetRate = this.currencyRates[this.currentCurrency] || 1;

    this.expenses.forEach((expense) => {
      const category = expense.category;
      if (!categoryWiseExpenses[category]) {
        categoryWiseExpenses[category] = 0;
      }
      // Convert amount for calculation if needed, or always store in base and convert for display
      categoryWiseExpenses[category] += expense.amount; // Store/calculate in base currency
    });

    const labels = Object.keys(categoryWiseExpenses).map(cat => this.getTranslation(cat));
    const data = Object.values(categoryWiseExpenses).map(amount => (amount / baseRate) * targetRate); // Convert for chart display
    const backgroundColor = labels.map((label, index) => CATEGORY_COLORS[Object.keys(categoryWiseExpenses)[index]]);
    const borderColor = backgroundColor.map(color => color.replace('0.6', '1')); // Make borders opaque

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = backgroundColor;
    this.chart.data.datasets[0].borderColor = borderColor;
    this.chart.options.scales.y.title.text = `${this.getTranslation('Amount')} (${currencySymbol})`;
    this.chart.options.plugins.title.text = this.getTranslation('Category-wise Expense Distribution');
    this.chart.update();
  }

  // --- Import/Export ---
  exportExpenses() {
    try {
      const expensesJSON = JSON.stringify(Array.from(this.expenses.values()), null, 2); // Pretty print JSON
      const blob = new Blob([expensesJSON], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `expenses_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      this.showAlert('success', this.getTranslation("Expenses exported successfully!"));
    } catch (error) {
        console.error('Error exporting expenses:', error);
        this.showAlert('error', this.getTranslation("Error exporting expenses."));
    }
  }

  importExpenses(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const expensesJSON = reader.result;
        const importedExpenses = JSON.parse(expensesJSON);
        // Ensure imported expenses have IDs and are valid
        const validExpenses = importedExpenses.map(exp => new Expense(exp.id, exp.name, exp.amount, exp.category, exp.date));
        this.expenses = new Map(validExpenses.map((expense) => [expense.id, expense]));
        await this.saveExpenses();
        this.currentPage = 1;
        this.currentSearchText = '';
        this.currentFilterCategory = 'All';
        document.getElementById('searchInput').value = '';
        document.getElementById('filter-category').value = 'All';
        this.applyFiltersAndSearch();
        this.calculateStatistics();
        this.showAlert('success', this.getTranslation("Expenses imported successfully!"));
      } catch (error) {
        console.error('Error importing expenses:', error);
        this.showAlert('error', this.getTranslation("Error importing expenses."));
      } finally {
        event.target.value = ''; // Clear file input
      }
    };
    reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        this.showAlert('error', this.getTranslation("Error importing expenses."));
    };
    reader.readAsText(file);
  }

  // --- Localization and Currency ---
  async fetchCurrencyRates() {
    // In a real application, you would make an API call from your backend here
    // Example (DISABLED due to API key exposure):
    /*
    const CURRENCY_API_URL = 'https://api.currencyapi.com/v3/latest';
    const CURRENCY_API_KEY = 'YOUR_CURRENCY_API_KEY'; // MUST be proxied via backend!
    try {
      const response = await axios.get(`${CURRENCY_API_URL}?apikey=${CURRENCY_API_KEY}&base_currency=INR`);
      this.currencyRates = response.data.data; // Assuming data.data holds the rates object
      console.log('Fetched currency rates:', this.currencyRates);
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      this.showAlert('error', this.getTranslation("Error fetching currency rates."));
    }
    */
    console.warn("Currency API call disabled. Using mock rates.");
  }

  getTranslation(key) {
    return MOCK_TRANSLATIONS[this.currentLanguage][key] || key;
  }

  translateUI() {
    // Translate static elements
    document.getElementById('app-title').textContent = this.getTranslation('Expense Tracker');
    document.getElementById('add-expense-btn').textContent = this.getTranslation('Add Expense');
    document.getElementById('searchInput').placeholder = this.getTranslation('Search expenses...');
    document.querySelector('#filter-category option[value="All"]').textContent = this.getTranslation('All');
    document.querySelector('#filter-category option[value="Food"]').textContent = this.getTranslation('Food');
    document.querySelector('#filter-category option[value="Transport"]').textContent = this.getTranslation('Transport');
    document.querySelector('#filter-category option[value="Entertainment"]').textContent = this.getTranslation('Entertainment');
    document.querySelector('#filter-category option[value="Other"]').textContent = this.getTranslation('Other');
    document.querySelector('#expense-table thead th:nth-child(1)').textContent = this.getTranslation('Name');
    document.querySelector('#expense-table thead th:nth-child(2)').textContent = this.getTranslation('Amount');
    document.querySelector('#expense-table thead th:nth-child(3)').textContent = this.getTranslation('Category');
    document.querySelector('#expense-table thead th:nth-child(4)').textContent = this.getTranslation('Date');
    document.querySelector('#expense-table thead th:nth-child(5)').textContent = this.getTranslation('Actions');
    document.getElementById('prev-page-btn').textContent = this.getTranslation('Prev');
    document.getElementById('next-page-btn').textContent = this.getTranslation('Next');
    document.getElementById('import-btn').textContent = this.getTranslation('Import');
    document.getElementById('export-btn').textContent = this.getTranslation('Export');
    document.getElementById('save-expense-btn').textContent = this.getTranslation('Save');
    document.getElementById('modal-title').textContent = this.getTranslation('Add Expense Modal'); // Default for modal
    document.getElementById('expense-name').placeholder = this.getTranslation('Expense Name');
    document.getElementById('expense-amount').placeholder = this.getTranslation('Amount');
    document.querySelector('#expense-category option[value=""]').textContent = this.getTranslation('Select Category');
    document.querySelector('#expense-category option[value="Food"]').textContent = this.getTranslation('Food');
    document.querySelector('#expense-category option[value="Transport"]').textContent = this.getTranslation('Transport');
    document.querySelector('#expense-category option[value="Entertainment"]').textContent = this.getTranslation('Entertainment');
    document.querySelector('#expense-category option[value="Other"]').textContent = this.getTranslation('Other');

    // Update current language in switcher
    document.getElementById('language-switcher').value = this.currentLanguage;
  }

  loadLanguageAndCurrencySettings() {
      const savedLang = localStorage.getItem('appLanguage');
      const savedCurrency = localStorage.getItem('appCurrency');
      if (savedLang && MOCK_TRANSLATIONS[savedLang]) {
          this.currentLanguage = savedLang;
          document.getElementById('language-switcher').value = savedLang;
      }
      if (savedCurrency && MOCK_CURRENCY_RATES[savedCurrency]) {
          this.currentCurrency = savedCurrency;
          document.getElementById('currency-switcher').value = savedCurrency;
      }
  }

  saveLanguageAndCurrencySettings() {
      localStorage.setItem('appLanguage', this.currentLanguage);
      localStorage.setItem('appCurrency', this.currentCurrency);
  }

  // --- Alert System ---
  showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transition = 'opacity 0.5s ease-out';
      alertDiv.addEventListener('transitionend', () => alertDiv.remove());
    }, 3000);
  }
}

// Initialize the app
const app = new App();