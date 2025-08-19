let deals = [
    { id: 1, propertyName: "Sunset Villa", stage: "Identified", dealValue: 500000, closeDate: "2025-09-15" },
    { id: 2, propertyName: "Downtown Loft", stage: "Negotiation", dealValue: 750000, closeDate: "2025-10-01" },
    { id: 3, propertyName: "Riverside Condo", stage: "Due Diligence", dealValue: 600000, closeDate: "2025-09-30" },
    { id: 4, propertyName: "Hilltop Estate", stage: "Closed", dealValue: 1200000, closeDate: "2025-08-10" },
    { id: 5, propertyName: "Beach House", stage: "Dropped", dealValue: 800000, closeDate: "2025-09-20" }
];

const stageClasses = {
    Identified: 'stage-identified',
    Negotiation: 'stage-negotiation',
    'Due Diligence': 'stage-due-diligence',
    Closed: 'stage-closed',
    Dropped: 'stage-dropped'
};

let sortColumn = 'propertyName';
let sortDirection = 1;
let editingDealId = null;

function renderTable(filteredDeals = deals) {
    const tableBody = document.getElementById('dealsTable');
    tableBody.innerHTML = '';

    filteredDeals.forEach(deal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${deal.propertyName}</td>
            <td>
                <select class="${stageClasses[deal.stage]}" onchange="updateStage(${deal.id}, this.value)">
                    <option value="Identified" ${deal.stage === 'Identified' ? 'selected' : ''}>Identified</option>
                    <option value="Negotiation" ${deal.stage === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                    <option value="Due Diligence" ${deal.stage === 'Due Diligence' ? 'selected' : ''}>Due Diligence</option>
                    <option value="Closed" ${deal.stage === 'Closed' ? 'selected' : ''}>Closed</option>
                    <option value="Dropped" ${deal.stage === 'Dropped' ? 'selected' : ''}>Dropped</option>
                </select>
            </td>
            <td>$${deal.dealValue.toLocaleString()}</td>
            <td>${deal.closeDate}</td>
            <td>
                <button class="btn btn-edit" onclick="openEditDealModal(${deal.id})">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderSummary() {
    const summaryCards = document.getElementById('summaryCards');
    const stages = ['Identified', 'Negotiation', 'Due Diligence', 'Closed', 'Dropped'];
    summaryCards.innerHTML = '';

    stages.forEach(stage => {
        const count = deals.filter(deal => deal.stage === stage).length;
        const card = document.createElement('div');
        card.className = `summary-card ${stageClasses[stage]}`;
        card.innerHTML = `
            <h3 class="font-semibold">${stage}</h3>
            <p class="text-2xl">${count} Deals</p>
        `;
        summaryCards.appendChild(card);
    });
}

function updateStage(id, newStage) {
    deals = deals.map(deal => deal.id === id ? { ...deal, stage: newStage } : deal);
    renderTable();
    renderSummary();
}

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection *= -1;
    } else {
        sortColumn = column;
        sortDirection = 1;
    }

    deals.sort((a, b) => {
        if (column === 'dealValue') {
            return (a.dealValue - b.dealValue) * sortDirection;
        } else if (column === 'closeDate') {
            return (new Date(a.closeDate) - new Date(b.closeDate)) * sortDirection;
        } else {
            return a[column].localeCompare(b[column]) * sortDirection;
        }
    });

    renderTable();
}

function filterDeals() {
    const stageFilter = document.getElementById('stageFilter').value;
    const propertyFilter = document.getElementById('propertyFilter').value.toLowerCase();

    let filteredDeals = deals;

    if (stageFilter) {
        filteredDeals = filteredDeals.filter(deal => deal.stage === stageFilter);
    }

    if (propertyFilter) {
        filteredDeals = filteredDeals.filter(deal => deal.propertyName.toLowerCase().includes(propertyFilter));
    }

    renderTable(filteredDeals);
}

function openModal() {
    document.getElementById('addDealModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addDealModal').style.display = 'none';
    document.getElementById('modalPropertyName').value = '';
    document.getElementById('modalStage').value = 'Identified';
    document.getElementById('modalDealValue').value = '';
    document.getElementById('modalCloseDate').value = '';
}

function saveDeal() {
    const propertyName = document.getElementById('modalPropertyName').value;
    const stage = document.getElementById('modalStage').value;
    const dealValue = parseFloat(document.getElementById('modalDealValue').value);
    const closeDate = document.getElementById('modalCloseDate').value;

    if (propertyName && !isNaN(dealValue) && closeDate) {
        const newDeal = {
            id: deals.length + 1,
            propertyName,
            stage,
            dealValue,
            closeDate
        };
        deals.push(newDeal);
        renderTable();
        renderSummary();
        closeModal();
    } else {
        alert('Please fill out all fields correctly.');
    }
}

function openEditDealModal(id) {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;
    editingDealId = id;
    document.getElementById('editDealPropertyName').value = deal.propertyName;
    document.getElementById('editDealStage').value = deal.stage;
    document.getElementById('editDealValue').value = deal.dealValue;
    document.getElementById('editCloseDate').value = deal.closeDate;
    document.getElementById('editDealModal').style.display = 'block';
}

function closeEditDealModal() {
    document.getElementById('editDealModal').style.display = 'none';
    editingDealId = null;
}

function handleEditDealSubmit(event) {
    event.preventDefault();
    if (editingDealId == null) return;
    const propertyName = document.getElementById('editDealPropertyName').value.trim();
    const stage = document.getElementById('editDealStage').value;
    const dealValue = parseFloat(document.getElementById('editDealValue').value);
    const closeDate = document.getElementById('editCloseDate').value;
    if (!propertyName || isNaN(dealValue) || !closeDate) {
        alert('Please fill out all fields correctly.');
        return;
    }
    deals = deals.map(d => d.id === editingDealId ? { id: editingDealId, propertyName, stage, dealValue, closeDate } : d);
    renderTable();
    renderSummary();
    closeEditDealModal();
}

document.getElementById('addDealBtn').addEventListener('click', openModal);
document.getElementById('cancelDealBtn').addEventListener('click', closeModal);
document.getElementById('saveDealBtn').addEventListener('click', saveDeal);
document.getElementById('stageFilter').addEventListener('change', filterDeals);
document.getElementById('propertyFilter').addEventListener('input', filterDeals);
document.getElementById('editDealForm').addEventListener('submit', handleEditDealSubmit);

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderSummary();
});