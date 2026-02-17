Script. Js 

// ===============================
// GLOBAL STATE
// ===============================

let chart;
let candleData = [];
let currentSymbol = "BTCUSDT";
let currentRange = 30;
let marketType = "crypto";

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];

// ===============================
// DOM ELEMENTS
// ===============================

const ctx = document.getElementById("chart").getContext("2d");
const symbolSelect = document.getElementById("symbolSelect");
const marketSelect = document.getElementById("marketType");
const livePriceEl = document.getElementById("livePrice");

const maToggle = document.getElementById("maToggle");
const rsiToggle = document.getElementById("rsiToggle");

const watchlistEl = document.getElementById("watchlist");
const addWatchBtn = document.getElementById("addWatch");
const watchSymbolInput = document.getElementById("watchSymbol");

const portfolioTable = document.getElementById("portfolioTable");
const portfolioValueEl = document.getElementById("portfolioValue");

// ===============================
// AUTO DETECT USER CURRENCY
// ===============================

const userCurrency = Intl.NumberFormat().resolvedOptions().currency || "USD";

// ===============================
// INITIALIZATION
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initChart();
  populateSymbols();
  renderWatchlist();
  renderPortfolio();
  fetchChartData();
});

// ===============================
// CHART INITIALIZATION
// ===============================

function initChart() {
  chart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [{
        label: currentSymbol,
        data: []
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

// ===============================
// MOCK DATA FETCH
// ===============================

function generateMockData(days) {
  let data = [];
  let price = 100;

  for (let i = 0; i < days; i++) {
    const open = price;
    const close = open + (Math.random() - 0.5) * 10;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;

    data.push({
      x: new Date(Date.now() - (days - i) * 86400000),
      o: open,
      h: high,
      l: low,
      c: close
    });

    price = close;
  }

  return data;
}

function fetchChartData() {
  candleData = generateMockData(currentRange);
  chart.data.datasets[0].data = candleData;
  chart.update();
  updateIndicators();
  updateLivePrice();
}

// ===============================
// INDICATORS
// ===============================

function calculateMA(data, period = 5) {
  return data.map((d, i) => {
    if (i < period) return null;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].c;
    }
    return { x: data[i].x, y: sum / period };
  }).filter(Boolean);
}

function updateIndicators() {

  chart.data.datasets = chart.data.datasets.slice(0, 1);

  if (maToggle.checked) {
    const maData = calculateMA(candleData);
    chart.data.datasets.push({
      type: "line",
      label: "MA",
      data: maData,
      borderWidth: 2,
      pointRadius: 0
    });
  }

  chart.update();
}

// ===============================
// RANGE SELECTOR
// ===============================

document.querySelectorAll(".range-controls button")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      currentRange = parseInt(btn.dataset.range);
      fetchChartData();
    });
  });

// ===============================
// MARKET SWITCH
// ===============================

marketSelect.addEventListener("change", () => {
  marketType = marketSelect.value;
  fetchChartData();
});

// ===============================
// LIVE PRICE SIMULATION
// ===============================

function updateLivePrice() {
  if (!candleData.length) return;
  const last = candleData[candleData.length - 1].c;
  livePriceEl.textContent =
    `Live Price: ${last.toFixed(2)} ${userCurrency}`;
}

// ===============================
// WATCHLIST
// ===============================

function renderWatchlist() {
  watchlistEl.innerHTML = "";
  watchlist.forEach(symbol => {
    const li = document.createElement("li");
    li.textContent = symbol;
    li.onclick = () => {
      currentSymbol = symbol;
      fetchChartData();
    };
    watchlistEl.appendChild(li);
  });
}

addWatchBtn.addEventListener("click", () => {
  const symbol = watchSymbolInput.value.trim().toUpperCase();
  if (!symbol) return;
  watchlist.push(symbol);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
  watchSymbolInput.value = "";
});

// ===============================
// PORTFOLIO
// ===============================

function renderPortfolio() {
  portfolioTable.innerHTML = "";
  let total = 0;

  portfolio.forEach(asset => {
    const currentPrice = candleData.length
      ? candleData[candleData.length - 1].c
      : asset.price;

    const value = currentPrice * asset.qty;
    total += value;

    const row = `
      <tr>
        <td>${asset.symbol}</td>
        <td>${asset.qty}</td>
        <td>${asset.price}</td>
        <td>${currentPrice.toFixed(2)}</td>
        <td>${value.toFixed(2)}</td>
      </tr>
    `;
    portfolioTable.innerHTML += row;
  });

  portfolioValueEl.textContent =
    `Total Value: ${total.toFixed(2)} ${userCurrency}`;
}

document.getElementById("addPortfolio")
  .addEventListener("click", () => {
    const symbol = document.getElementById("portfolioSymbol").value;
    const qty = parseFloat(document.getElementById("portfolioQty").value);
    const price = parseFloat(document.getElementById("portfolioPrice").value);

    if (!symbol || !qty || !price) return;

    portfolio.push({ symbol, qty, price });
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    renderPortfolio();
  });

// ===============================
// CSV EXPORT
// ===============================

document.getElementById("exportCSV")
  .addEventListener("click", () => {

    let csv = "Symbol,Qty,Buy Price\n";
    portfolio.forEach(p => {
      csv += `${p.symbol},${p.qty},${p.price}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "portfolio.csv";
    link.click();
  });

// ===============================
// LOGIN / REGISTER
// ===============================

document.getElementById("loginBtn").onclick =
  () => document.getElementById("loginModal")
    .classList.remove("hidden");

document.getElementById("registerBtn").onclick =
  () => document.getElementById("registerModal")
    .classList.remove("hidden");

window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.classList.add("hidden");
  }
};

// ===============================
// SYMBOL POPULATION
// ===============================

function populateSymbols() {
  const symbols = ["BTCUSDT", "ETHUSDT", "EURUSD", "GBPUSD"];
  symbols.forEach(sym => {
    const option = document.createElement("option");
    option.value = sym;
    option.textContent = sym;
    symbolSelect.appendChild(option);
  });
}

symbolSelect.addEventListener("change", () => {
  currentSymbol = symbolSelect.value;
  fetchChartData();
});

// ===============================
// INDEXEDDB CACHE (BASIC)
// ===============================

let db;

const request = indexedDB.open("TradingCache", 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  db.createObjectStore("charts", { keyPath: "symbol" });
};

request.onsuccess = function (e) {
  db = e.target.result;
};

function cacheChart(symbol, data) {
  const tx = db.transaction("charts", "readwrite");
  const store = tx.objectStore("charts");
  store.put({ symbol, data });
}
