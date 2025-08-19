// Dummy data
let properties = [
  { id: 1, status: 'Available', city: 'New York' },
  { id: 2, status: 'Sold', city: 'Los Angeles' },
  { id: 3, status: 'Rented', city: 'Chicago' },
  { id: 4, status: 'Available', city: 'Miami' },
  { id: 5, status: 'Pending', city: 'San Francisco' },
  { id: 6, status: 'Available', city: 'New York' },
  { id: 7, status: 'Rented', city: 'Chicago' },
  { id: 8, status: 'Sold', city: 'Los Angeles' }
];

let deals = [
  { id: 1, status: 'Closed', value: 500000, closeDate: '2025-01-15' },
  { id: 2, status: 'Closed', value: 750000, closeDate: '2025-02-10' },
  { id: 3, status: 'Closed', value: 600000, closeDate: '2025-03-25' },
  { id: 4, status: 'Negotiation', value: 1200000, closeDate: null },
  { id: 5, status: 'Closed', value: 800000, closeDate: '2025-03-30' }
];

// Chart instances
let charts = {
  statusBar: null,
  cityPie: null,
  dealsLine: null
};

// Utility: count by key
function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

// Utility: format currency
function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);
}

// Summary cards
function updateSummaries() {
  const totalProps = properties.length;
  const activeDeals = deals.filter(d => d.status !== 'Dropped').length;
  const closedDeals = deals.filter(d => d.status === 'Closed');
  const avgDealValue = closedDeals.length ? closedDeals.reduce((s, d) => s + d.value, 0) / closedDeals.length : 0;

  const elTotal = document.getElementById('summaryTotalProperties');
  const elActive = document.getElementById('summaryActiveDeals');
  const elAvg = document.getElementById('summaryAvgDealValue');
  if (elTotal) elTotal.textContent = totalProps.toString();
  if (elActive) elActive.textContent = activeDeals.toString();
  if (elAvg) elAvg.textContent = formatCurrency(avgDealValue);
}

// Create charts
function renderCharts() {
  // Destroy existing to allow dynamic updates
  if (charts.statusBar) charts.statusBar.destroy();
  if (charts.cityPie) charts.cityPie.destroy();
  if (charts.dealsLine) charts.dealsLine.destroy();

  // Data: Properties by Status
  const statusCounts = countBy(properties, 'status');
  const statusLabels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);

  const statusCtx = document.getElementById('propertiesStatusChart');
  if (statusCtx) {
    charts.statusBar = new Chart(statusCtx, {
      type: 'bar',
      data: {
        labels: statusLabels,
        datasets: [{
          label: 'Properties',
          data: statusData,
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#ccc' } }, x: { ticks: { color: '#ccc' } } }
      }
    });
  }

  // Data: Properties by City (Pie)
  const cityCounts = countBy(properties, 'city');
  const cityLabels = Object.keys(cityCounts);
  const cityData = Object.values(cityCounts);
  const pieColors = ['#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#e74c3c', '#16a085', '#2ecc71'];

  const cityCtx = document.getElementById('propertiesCityChart');
  if (cityCtx) {
    charts.cityPie = new Chart(cityCtx, {
      type: 'pie',
      data: {
        labels: cityLabels,
        datasets: [{ data: cityData, backgroundColor: pieColors.slice(0, cityLabels.length) }]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: '#ccc' } } } }
    });
  }

  // Data: Deals Closed per Month (Line)
  const closed = deals.filter(d => d.status === 'Closed' && d.closeDate);
  const months = Array.from({ length: 12 }, (_, i) => i); // 0..11
  const monthCounts = months.map(m => closed.filter(d => new Date(d.closeDate).getMonth() === m).length);
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const dealsCtx = document.getElementById('dealsClosedChart');
  if (dealsCtx) {
    charts.dealsLine = new Chart(dealsCtx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Closed Deals',
          data: monthCounts,
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: '#ccc' } } }, scales: { y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#ccc' } }, x: { ticks: { color: '#ccc' } } } }
    });
  }
}

// Public API to update data and re-render
window.reportsData = {
  setProperties(newProps) {
    properties = Array.isArray(newProps) ? newProps : properties;
    updateSummaries();
    renderCharts();
  },
  setDeals(newDeals) {
    deals = Array.isArray(newDeals) ? newDeals : deals;
    updateSummaries();
    renderCharts();
  },
  getProperties: () => properties,
  getDeals: () => deals
};

document.addEventListener('DOMContentLoaded', () => {
  updateSummaries();
  renderCharts();
});


