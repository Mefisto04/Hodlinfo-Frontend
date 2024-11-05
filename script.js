const itemsPerPage = 10;
let currentPage = 1;
let stockData = [];

async function loadTickers() {
  try {
    const response = await fetch("http://localhost:3000/api/tickers");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    stockData = await response.json();
    displayData();
  } catch (error) {
    console.error("Error fetching tickers:", error);
  }
}

function displayData() {
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = stockData.slice(start, start + itemsPerPage);
  const tableBody = document.querySelector("#tickersTable tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((ticker) => {
    const imgSrc = `./public/${ticker.base_unit.toLowerCase()}.svg`;
    const row = document.createElement("tr");

    row.innerHTML = `
            <td class="py-2 px-4">
                <img src="${imgSrc}" alt="${ticker.base_unit}" class="stock-image" style="width: 20px; height: 20px; margin-right: 8px;">
                ${ticker.name}
            </td>
            <td class="py-2 px-4">${ticker.last}</td>
            <td class="py-2 px-4">${ticker.buy}</td>
            <td class="py-2 px-4">${ticker.sell}</td>
            <td class="py-2 px-4">${ticker.volume}</td>
            <td class="py-2 px-4">${ticker.base_unit}</td>
            <td class="py-2 px-4">${ticker.open}</td>
            <td class="py-2 px-4">${ticker.low}</td>
            <td class="py-2 px-4">${ticker.high}</td>
        `;

    row.addEventListener("click", () => updateStockCard(ticker));
    tableBody.appendChild(row);
  });
}

function updateStockCard(ticker) {
  const imgSrc = `./public/${ticker.base_unit.toLowerCase()}.svg`;
  const stockLogo = document.getElementById("stockLogo");

  if (stockLogo) {
    stockLogo.src = imgSrc;
    stockLogo.style.display = "block";
  }

  document.getElementById("stockName").textContent = ticker.name;
  document.getElementById("stockType").textContent = ticker.type || "";
  document.getElementById("lastPrice").textContent = `${
    ticker.last
  } ${ticker.quote_unit.toUpperCase()}`;
  document.getElementById("openPrice").textContent = ticker.open;
  document.getElementById("volume").textContent = ticker.volume;
  document.getElementById("lowPrice").textContent = ticker.low;
  document.getElementById("highPrice").textContent = ticker.high;
  document.getElementById("buyPrice").textContent = ticker.buy;
  document.getElementById("sellPrice").textContent = ticker.sell;
  document.getElementById("lastUpdated").textContent = formatDate(ticker.at);
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

window.onload = loadTickers;

function displayFilteredData(filteredData, totalPages) {
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(start, start + itemsPerPage);
  const tableBody = document.querySelector("#tickersTable tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((ticker) => {
    const imgSrc = `./public/${ticker.base_unit.toLowerCase()}.svg`;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="py-2 px-4">
                <img src="${imgSrc}" alt="${ticker.base_unit}" class="stock-image" style="width: 20px; height: 20px; margin-right: 8px;">
                ${ticker.name}
            </td>
            <td class="py-2 px-4">${ticker.last}</td>
            <td class="py-2 px-4">${ticker.buy}</td>
            <td class="py-2 px-4">${ticker.sell}</td>
            <td class="py-2 px-4">${ticker.volume}</td>
            <td class="py-2 px-4">${ticker.base_unit}</td>
            <td class="py-2 px-4">${ticker.open}</td>
            <td class="py-2 px-4">${ticker.low}</td>
            <td class="py-2 px-4">${ticker.high}</td>
        `;
    tableBody.appendChild(row);
  });

  document.getElementById(
    "pageInfo"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevButton").disabled = currentPage === 1;
  document.getElementById("nextButton").disabled = currentPage === totalPages;
}

function nextPage() {
  if (currentPage < Math.ceil(stockData.length / itemsPerPage)) {
    currentPage++;
    displayData();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayData();
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filteredData = stockData.filter((ticker) =>
    ticker.name.toLowerCase().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  currentPage = 1;
  displayFilteredData(filteredData, totalPages);
});

function displayFilteredData(filteredData, totalPages) {
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(start, start + itemsPerPage);
  const tableBody = document.querySelector("#tickersTable tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((ticker) => {
    const imgSrc = `./public/${ticker.base_unit.toLowerCase()}.svg`;

    const lastPrice = parseFloat(ticker.last);
    const openPrice = parseFloat(ticker.open);
    const difference = (((lastPrice - openPrice) / openPrice) * 100).toFixed(2); // Difference in percentage

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td class="py-2 px-4">
                        <img src="${imgSrc}" alt="${ticker.base_unit}" class="stock-image" style="width: 20px; height: 20px; margin-right: 8px;">
                        ${ticker.name}
                    </td>
                    <td class="py-2 px-4">${lastPrice}</td>
                    <td class="py-2 px-4">${ticker.buy}</td>
                    <td class="py-2 px-4">${ticker.sell}</td>
                    <td class="py-2 px-4">${ticker.volume}</td>
                    <td class="py-2 px-4">${ticker.base_unit}</td>
                    <td class="py-2 px-4">${openPrice}</td>
                    <td class="py-2 px-4">${ticker.low}</td>
                    <td class="py-2 px-4">${ticker.high}</td>
                `;
    tableBody.appendChild(row);
  });

  document.getElementById(
    "pageInfo"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevButton").disabled = currentPage === 1;
  document.getElementById("nextButton").disabled = currentPage === totalPages;
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  displayData();
}

loadTickers();
