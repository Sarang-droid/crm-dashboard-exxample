// Aggregate summaries and quick charts for Dashboard

// Dummy sources (can be replaced with shared store or API later)
const dashProperties = [
  { status: 'Available' }, { status: 'Sold' }, { status: 'Rented' }, { status: 'Pending' },
  { status: 'Available' }, { status: 'Available' }, { status: 'Sold' }, { status: 'Rented' }
];

const dashDeals = [
  { status: 'Closed', value: 500000, closeDate: '2025-01-15' },
  { status: 'Closed', value: 750000, closeDate: '2025-02-10' },
  { status: 'Closed', value: 600000, closeDate: '2025-03-25' },
  { status: 'Negotiation', value: 1200000, closeDate: null },
  { status: 'Closed', value: 800000, closeDate: '2025-03-30' }
];

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);
}

function updateSummaryCards() {
  const totalProps = dashProperties.length;
  const statusCounts = countBy(dashProperties, 'status');
  const totalDeals = dashDeals.length;
  const activeDeals = dashDeals.filter(d => d.status !== 'Dropped').length;
  const closedDeals = dashDeals.filter(d => d.status === 'Closed');
  const avgDealValue = closedDeals.length ? closedDeals.reduce((s, d) => s + d.value, 0) / closedDeals.length : 0;

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('sumTotalProps', totalProps);
  setText('sumAvailable', statusCounts['Available'] || 0);
  setText('sumSold', statusCounts['Sold'] || 0);
  setText('sumRented', statusCounts['Rented'] || 0);
  setText('sumPending', statusCounts['Pending'] || 0);
  setText('sumTotalDeals', totalDeals);
  setText('sumActiveDeals', activeDeals);
  setText('sumClosedDeals', closedDeals.length);
  setText('sumAvgDealValue', formatCurrency(avgDealValue));
}

let propsStatusChart, dealsClosedChart;

function renderCharts() {
  if (propsStatusChart) propsStatusChart.destroy();
  if (dealsClosedChart) dealsClosedChart.destroy();

  // Properties by Status (bar)
  const statusCounts = countBy(dashProperties, 'status');
  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);
  const ctx1 = document.getElementById('dashPropsStatus');
  if (ctx1) {
    propsStatusChart = new Chart(ctx1, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Properties', data, backgroundColor: '#3498db' }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#ccc' } }, x: { ticks: { color: '#ccc' } } } }
    });
  }

  // Deals closed per month (line)
  const closed = dashDeals.filter(d => d.status === 'Closed' && d.closeDate);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthCounts = months.map(m => closed.filter(d => new Date(d.closeDate).getMonth() === m).length);
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ctx2 = document.getElementById('dashDealsClosed');
  if (ctx2) {
    dealsClosedChart = new Chart(ctx2, {
      type: 'line',
      data: { labels: monthLabels, datasets: [{ label: 'Closed Deals', data: monthCounts, borderColor: '#9b59b6', backgroundColor: 'rgba(155, 89, 182, 0.2)', tension: 0.3, fill: true }] },
      options: { responsive: true, plugins: { legend: { labels: { color: '#ccc' } } }, scales: { y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#ccc' } }, x: { ticks: { color: '#ccc' } } } }
    });
  }
}

// Public API to allow future sync with other pages
window.dashboardData = {
  setProperties(list) { if (Array.isArray(list)) { dashProperties.length = 0; dashProperties.push(...list); updateSummaryCards(); renderCharts(); } },
  setDeals(list) { if (Array.isArray(list)) { dashDeals.length = 0; dashDeals.push(...list); updateSummaryCards(); renderCharts(); } },
  getProperties: () => dashProperties,
  getDeals: () => dashDeals
};

document.addEventListener('DOMContentLoaded', () => {
  updateSummaryCards();
  renderCharts();
});


