class LengthConverter {
  constructor() {
    this.fromUnitSelect = document.getElementById('fromUnit');
    this.toUnitSelect = document.getElementById('toUnit');
    this.inputValue = document.getElementById('inputValue');
    this.resultElement = document.getElementById('result');
    this.errorElement = document.getElementById('error');
    this.precisionInput = document.getElementById('precision');
    this.precisionValueElement = document.getElementById('precisionValue');
    this.swapUnitsButton = document.getElementById('swapUnits');
    this.darkModeToggle = document.getElementById('darkModeToggle');
    this.historyElement = document.getElementById('history');
    this.clearButton = document.getElementById('clearButton');
    this.copyButton = document.getElementById('copyButton');
    this.toggleHistoryButton = document.getElementById('toggleHistory');
    this.loadingElement = document.getElementById('loading');
    this.favoritesElement = document.getElementById('favorites');
    this.addFavoriteButton = document.getElementById('addFavorite');
    this.resetButton = document.getElementById('reset');

    this.precision = parseInt(this.precisionInput.value);
    this.units = {
      km: { factor: 1000, name: 'Kilometer' },
      m: { factor: 1, name: 'Meter' },
      cm: { factor: 0.01, name: 'Centimeter' },
      mm: { factor: 0.001, name: 'Millimeter' },
      um: { factor: 0.000001, name: 'Micrometer' },
      nm: { factor: 0.000000001, name: 'Nanometer' },
      mi: { factor: 1609.34, name: 'Mile' },
      yd: { factor: 0.9144, name: 'Yard' },
      ft: { factor: 0.3048, name: 'Foot' },
      in: { factor: 0.0254, name: 'Inch' },
    };

    this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    this.history = JSON.parse(localStorage.getItem('history')) || [];

    this.initUnits();
    this.addEventListeners();
    this.loadHistory();
    this.loadFavorites();
  }

  initUnits() {
    const units = this.units;
    Object.keys(units).forEach((unit) => {
      const option = document.createElement('option');
      option.value = unit;
      option.text = units[unit].name;
      this.fromUnitSelect.add(option);
      this.toUnitSelect.add(option.cloneNode(true));
    });
  }

  addEventListeners() {
    this.inputValue.addEventListener('input', () => this.convert());
    this.fromUnitSelect.addEventListener('change', () => this.convert());
    this.toUnitSelect.addEventListener('change', () => this.convert());
    this.precisionInput.addEventListener('input', (e) => {
      this.precision = parseInt(e.target.value);
      this.precisionValueElement.innerText = this.precision;
      this.convert();
    });
    this.swapUnitsButton.addEventListener('click', () => this.swapUnits());
    this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    this.clearButton.addEventListener('click', () => this.clearInput());
    this.copyButton.addEventListener('click', () => this.copyToClipboard());
    this.toggleHistoryButton.addEventListener('click', () => this.toggleHistory());
    this.addFavoriteButton.addEventListener('click', () => this.addFavorite());
    this.resetButton.addEventListener('click', () => this.reset());
  }

  convert() {
    this.showLoading();
    const inputValue = parseFloat(this.inputValue.value);
    const fromUnit = this.fromUnitSelect.value;
    const toUnit = this.toUnitSelect.value;

    if (isNaN(inputValue)) {
      this.errorElement.innerText = 'Please enter a valid number';
      this.hideLoading();
      return;
    }

    const result = (inputValue / this.units[fromUnit].factor) * this.units[toUnit].factor;
    const formattedResult = numeral(result).format(`0.${this.precision} a`);
    this.resultElement.innerText = `${formattedResult} ${this.units[toUnit].name}`;
    this.errorElement.innerText = '';
    this.saveHistory(inputValue, fromUnit, toUnit, result);
    this.hideLoading();
  }

  swapUnits() {
    const fromUnit = this.fromUnitSelect.value;
    const toUnit = this.toUnitSelect.value;
    this.fromUnitSelect.value = toUnit;
    this.toUnitSelect.value = fromUnit;
    this.convert();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }

  clearInput() {
    this.inputValue.value = '';
    this.resultElement.innerText = '';
    this.errorElement.innerText = '';
  }

  copyToClipboard() {
    const result = this.resultElement.innerText;
    navigator.clipboard.writeText(result).then(() => {
      toastr.success('Copied to clipboard!');
    });
  }

  toggleHistory() {
    const history = this.historyElement;
    if (history.style.display === 'block') {
      history.style.display = 'none';
    } else {
      history.style.display = 'block';
    }
  }

  showLoading() {
    this.loadingElement.style.display = 'block';
  }

  hideLoading() {
    this.loadingElement.style.display = 'none';
  }

  saveHistory(inputValue, fromUnit, toUnit, result) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({
      inputValue,
      fromUnit,
      toUnit,
      result,
    });
    localStorage.setItem('history', JSON.stringify(history));
    this.loadHistory();
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const historyHTML = history.map((entry) => {
      return `<p>${entry.inputValue} ${this.units[entry.fromUnit].name} = ${entry.result} ${this.units[entry.toUnit].name}</p>`;
    }).join('');
    this.historyElement.innerHTML = historyHTML;
  }

  addFavorite() {
    const inputValue = this.inputValue.value;
    const fromUnit = this.fromUnitSelect.value;
    const toUnit = this.toUnitSelect.value;
    const result = this.resultElement.innerText;
    this.favorites.push({ inputValue, fromUnit, toUnit, result });
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.loadFavorites();
  }

  loadFavorites() {
    const favoritesHTML = this.favorites.map((favorite) => {
      return `<p>${favorite.inputValue} ${this.units[favorite.fromUnit].name} = ${favorite.result}</p>`;
    }).join('');
    this.favoritesElement.innerHTML = favoritesHTML;
  }

  reset() {
    this.inputValue.value = '';
    this.resultElement.innerText = '';
    this.favorites = [];
    this.history = [];
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    localStorage.setItem('history', JSON.stringify(this.history));
    this.loadFavorites();
    this.loadHistory();
  }
}

const lengthConverter = new LengthConverter();

// Check for dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}