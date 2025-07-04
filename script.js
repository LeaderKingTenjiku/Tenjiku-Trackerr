// === script.js ===
let page = 1;
const perPage = 5;
let activeTab = 'all';
let currency = 'usd';
let allCoins = [];
let previousPrices = JSON.parse(localStorage.getItem("cryptoPrices")) || {};

function changePage(direction) {
  page += direction;
  if (page < 1) page = 1;
  document.getElementById("page-number").innerText = `Page ${page}`;
  renderCryptoData();
}

async function loadAllCryptoData() {
  try {
    const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: currency,
        order: "market_cap_desc",
        per_page: 250,
        page: 1,
        price_change_percentage: '24h'
      }
    });

    allCoins = res.data;
    renderCryptoData();
  } catch (err) {
    console.error("Error loading data", err);
  }
}

function renderCryptoData() {
  const container = document.getElementById("crypto-list");
  container.innerHTML = "";

  let filtered = allCoins;
  const search = document.getElementById("searchBar").value.toLowerCase();

  if (search) {
    filtered = filtered.filter(coin =>
      coin.name.toLowerCase().includes(search) ||
      coin.symbol.toLowerCase().includes(search)
    );
  }

  if (activeTab === 'gainers') {
    filtered = [...filtered].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 10);
  } else if (activeTab === 'losers') {
    filtered = [...filtered].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 10);
  } else {
    filtered = filtered.slice((page - 1) * perPage, page * perPage);
  }

  filtered.forEach(coin => {
    const { id, name, symbol, current_price, price_change_percentage_24h, market_cap } = coin;

    if (previousPrices[id] && previousPrices[id] !== current_price) {
      const diff = current_price - previousPrices[id];
      const direction = diff > 0 ? "increased" : "decreased";
      showNotification(`${name} price ${direction} by ${formatCurrency(Math.abs(diff))}`);
    }

    previousPrices[id] = current_price;

    const row = document.createElement("div");
    row.className = "coin-item";
    row.onclick = () => drawChart(id, name);
    row.innerHTML = `
      <span><strong>${name}</strong> (${symbol.toUpperCase()})</span>
      <span>${formatCurrency(current_price)}</span>
      <span style="color: ${price_change_percentage_24h >= 0 ? 'green' : 'red'}">
        ${price_change_percentage_24h?.toFixed(2) ?? 0}%
      </span>
      <span>${formatCurrency(market_cap)}</span>
    `;
    container.appendChild(row);
  });

  localStorage.setItem("cryptoPrices", JSON.stringify(previousPrices));
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(val);
}

async function drawChart(coinId, coinName) {
  document.getElementById("chart-title").innerText = `${coinName} – 7 Day Price Chart`;

  const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: currency,
      days: 7
    }
  });

  const prices = res.data.prices;
  const labels = prices.map(p => new Date(p[0]).toLocaleDateString());
  const data = prices.map(p => p[1]);

  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${coinName} ${currency.toUpperCase()}`,
        data: data,
        borderColor: "#007bff",
        backgroundColor: "#007bff22",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#000" } } },
      scales: {
        x: { ticks: { color: "#777" } },
        y: { ticks: { color: "#777" } }
      }
    }
  });
}

function showNotification(msg) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.innerText = msg;
  document.getElementById("notifications").appendChild(notif);
  setTimeout(() => notif.remove(), 5000);
}

function showTab(tab) {
  activeTab = tab;
  page = 1;
  document.querySelectorAll(".tab-buttons button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-buttons button[onclick*='${tab}']`).classList.add("active");
  renderCryptoData();
}

document.getElementById("searchBar").addEventListener("input", renderCryptoData);
document.getElementById("currencySwitcher").addEventListener("change", (e) => {
  currency = e.target.value;
  loadAllCryptoData();
});

loadAllCryptoData();
setInterval(loadAllCryptoData, 30000);
