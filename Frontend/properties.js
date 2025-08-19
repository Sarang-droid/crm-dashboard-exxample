// Properties Management JavaScript

// Dummy property data
let properties = [
    {
        id: 1,
        name: "Luxury Downtown Apartment",
        location: "New York, NY",
        size: 1200,
        price: 850000,
        status: "Available",
        owner: "Sarah Johnson",
        lastUpdated: "2024-01-15"
    },
    {
        id: 2,
        name: "Modern Family House",
        location: "Los Angeles, CA",
        size: 2500,
        price: 1200000,
        status: "Sold",
        owner: "Michael Chen",
        lastUpdated: "2024-01-20"
    },
    {
        id: 3,
        name: "Cozy Studio",
        location: "Chicago, IL",
        size: 600,
        price: 180000,
        status: "Rented",
        owner: "Emily Davis",
        lastUpdated: "2024-01-18"
    },
    {
        id: 4,
        name: "Beachfront Condo",
        location: "Miami, FL",
        size: 1800,
        price: 950000,
        status: "Available",
        owner: "Robert Wilson",
        lastUpdated: "2024-01-22"
    },
    {
        id: 5,
        name: "Victorian House",
        location: "San Francisco, CA",
        size: 3200,
        price: 2100000,
        status: "Pending",
        owner: "Lisa Anderson",
        lastUpdated: "2024-01-19"
    },
    {
        id: 6,
        name: "Urban Loft",
        location: "New York, NY",
        size: 1500,
        price: 750000,
        status: "Available",
        owner: "David Martinez",
        lastUpdated: "2024-01-21"
    },
    {
        id: 7,
        name: "Suburban Home",
        location: "Chicago, IL",
        size: 2200,
        price: 450000,
        status: "Rented",
        owner: "Jennifer Brown",
        lastUpdated: "2024-01-17"
    },
    {
        id: 8,
        name: "Penthouse Suite",
        location: "Los Angeles, CA",
        size: 4000,
        price: 3500000,
        status: "Available",
        owner: "Thomas Garcia",
        lastUpdated: "2024-01-23"
    }
];

// Store filtered properties
let filteredProperties = [...properties];

// DOM Elements
const tableBody = document.getElementById('properties-table-body');
const globalSearch = document.getElementById('globalSearch');
const cityFilter = document.getElementById('cityFilter');
const statusFilter = document.getElementById('statusFilter');
const ownerFilter = document.getElementById('ownerFilter');
const emptyState = document.getElementById('emptyState');
const addPropertyModal = document.getElementById('addPropertyModal');
const addPropertyForm = document.getElementById('addPropertyForm');
const editPropertyModal = document.getElementById('editPropertyModal');
const editPropertyForm = document.getElementById('editPropertyForm');

// State
let editingPropertyId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    populateOwnerFilter();
    renderTable();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    globalSearch.addEventListener('input', handleSearch);
    cityFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    ownerFilter.addEventListener('change', applyFilters);
    addPropertyForm.addEventListener('submit', handleAddProperty);
    if (editPropertyForm) {
        editPropertyForm.addEventListener('submit', handleEditProperty);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addPropertyModal) {
            closeAddPropertyModal();
        }
        if (event.target === editPropertyModal) {
            closeEditPropertyModal();
        }
    });
}

// Populate owner filter dropdown
function populateOwnerFilter() {
    const owners = [...new Set(properties.map(prop => prop.owner))].sort();
    ownerFilter.innerHTML = '<option value="">All Owners</option>';
    
    owners.forEach(owner => {
        const option = document.createElement('option');
        option.value = owner;
        option.textContent = owner;
        ownerFilter.appendChild(option);
    });
}

// Handle global search
function handleSearch() {
    const searchTerm = globalSearch.value.toLowerCase();
    
    filteredProperties = properties.filter(property => 
        property.name.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.owner.toLowerCase().includes(searchTerm)
    );
    
    applyFilters();
}

// Apply filters
function applyFilters() {
    let filtered = filteredProperties;
    
    // Apply city filter
    if (cityFilter.value) {
        filtered = filtered.filter(property => 
            property.location.includes(cityFilter.value)
        );
    }
    
    // Apply status filter
    if (statusFilter.value) {
        filtered = filtered.filter(property => 
            property.status === statusFilter.value
        );
    }
    
    // Apply owner filter
    if (ownerFilter.value) {
        filtered = filtered.filter(property => 
            property.owner === ownerFilter.value
        );
    }
    
    // If no search term, use all properties for filtering
    if (!globalSearch.value) {
        filtered = properties.filter(property => {
            let matchesCity = !cityFilter.value || property.location.includes(cityFilter.value);
            let matchesStatus = !statusFilter.value || property.status === statusFilter.value;
            let matchesOwner = !ownerFilter.value || property.owner === ownerFilter.value;
            
            return matchesCity && matchesStatus && matchesOwner;
        });
    }
    
    renderTable(filtered);
}

// Clear all filters
function clearFilters() {
    globalSearch.value = '';
    cityFilter.value = '';
    statusFilter.value = '';
    ownerFilter.value = '';
    filteredProperties = [...properties];
    renderTable();
}

// Render table
function renderTable(data = properties) {
    if (data.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.properties-table').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.querySelector('.properties-table').style.display = 'block';
    
    tableBody.innerHTML = '';
    
    data.forEach(property => {
        const row = createTableRow(property);
        tableBody.appendChild(row);
    });
}

// Create table row
function createTableRow(property) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><strong>${property.name}</strong></td>
        <td>${property.location}</td>
        <td>${formatSize(property.size)}</td>
        <td><span class="status-badge status-${property.status.toLowerCase()}">${property.status}</span></td>
        <td>${property.owner}</td>
        <td>${formatDate(property.lastUpdated)}</td>
        <td>
            <div class="actions">
                <button class="btn btn-edit" onclick="editProperty(${property.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="deleteProperty(${property.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Format size
function formatSize(size) {
    return `${size.toLocaleString()} sq ft`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Open add property modal
function openAddPropertyModal() {
    addPropertyModal.style.display = 'block';
    // Reset form
    addPropertyForm.reset();
}

// Close add property modal
function closeAddPropertyModal() {
    addPropertyModal.style.display = 'none';
}

// Handle add property form submission
function handleAddProperty(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Create new property object
    const newProperty = {
        id: Math.max(...properties.map(p => p.id)) + 1,
        name: document.getElementById('propertyName').value,
        location: document.getElementById('propertyLocation').value,
        size: parseInt(document.getElementById('propertySize').value),
        price: parseInt(document.getElementById('propertyPrice').value),
        status: document.getElementById('propertyStatus').value,
        owner: document.getElementById('propertyOwner').value,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Validate required fields
    if (!newProperty.name || !newProperty.location || !newProperty.size || 
        !newProperty.price || !newProperty.status || !newProperty.owner) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Add to properties array
    properties.push(newProperty);
    
    // Update filtered properties
    filteredProperties = [...properties];
    
    // Refresh owner filter
    populateOwnerFilter();
    
    // Re-render table
    renderTable();
    
    // Close modal
    closeAddPropertyModal();
    
    // Show success message
    showNotification('Property added successfully!', 'success');
}

// Edit property (placeholder)
function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    openEditPropertyModal(property);
}

function openEditPropertyModal(property) {
    editingPropertyId = property.id;
    document.getElementById('editPropertyName').value = property.name;
    document.getElementById('editPropertyLocation').value = property.location;
    document.getElementById('editPropertySize').value = property.size;
    document.getElementById('editPropertyPrice').value = property.price;
    document.getElementById('editPropertyStatus').value = property.status;
    document.getElementById('editPropertyOwner').value = property.owner;
    editPropertyModal.style.display = 'block';
}

function closeEditPropertyModal() {
    editPropertyModal.style.display = 'none';
    editingPropertyId = null;
    if (editPropertyForm) editPropertyForm.reset();
}

function handleEditProperty(event) {
    event.preventDefault();
    if (editingPropertyId == null) return;
    const idx = properties.findIndex(p => p.id === editingPropertyId);
    if (idx === -1) return;
    const updated = {
        name: document.getElementById('editPropertyName').value.trim(),
        location: document.getElementById('editPropertyLocation').value.trim(),
        size: parseInt(document.getElementById('editPropertySize').value, 10),
        price: parseInt(document.getElementById('editPropertyPrice').value, 10),
        status: document.getElementById('editPropertyStatus').value,
        owner: document.getElementById('editPropertyOwner').value.trim()
    };
    if (!updated.name || !updated.location || !updated.size || !updated.price || !updated.status || !updated.owner) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    properties[idx] = {
        ...properties[idx],
        ...updated,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    filteredProperties = [...properties];
    populateOwnerFilter();
    renderTable();
    closeEditPropertyModal();
    showNotification('Property updated successfully!', 'success');
}

// Delete property
function deleteProperty(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
            // Remove from properties array
            properties = properties.filter(p => p.id !== id);
            
            // Update filtered properties
            filteredProperties = filteredProperties.filter(p => p.id !== id);
            
            // Refresh owner filter
            populateOwnerFilter();
            
            // Re-render table
            renderTable();
            
            // Show success message
            showNotification('Property deleted successfully!', 'success');
        }
    }
}

// Show notification (simple implementation)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 4px;
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K for search focus
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        globalSearch.focus();
        globalSearch.select();
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        if (addPropertyModal.style.display === 'block') closeAddPropertyModal();
        if (editPropertyModal && editPropertyModal.style.display === 'block') closeEditPropertyModal();
    }
    
    // Ctrl/Cmd + N for new property
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        openAddPropertyModal();
    }
});

// Additional utility functions

// Sort properties
function sortProperties(column, direction = 'asc') {
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];
        
        // Handle different data types
        if (column === 'size' || column === 'price') {
            aValue = Number(aValue);
            bValue = Number(bValue);
        } else if (column === 'lastUpdated') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
        }
        
        if (direction === 'asc') {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });
    
    renderTable(sortedProperties);
}

// Export properties to CSV
function exportPropertiesToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Property Name,Location,Size (sq ft),Price,Status,Owner,Last Updated\n"
        + filteredProperties.map(property => 
            `"${property.name}","${property.location}",${property.size},${property.price},"${property.status}","${property.owner}","${property.lastUpdated}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "properties.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Properties exported successfully!', 'success');
}

// Property statistics
function getPropertyStatistics() {
    const stats = {
        total: properties.length,
        available: properties.filter(p => p.status === 'Available').length,
        sold: properties.filter(p => p.status === 'Sold').length,
        rented: properties.filter(p => p.status === 'Rented').length,
        pending: properties.filter(p => p.status === 'Pending').length,
        averagePrice: properties.reduce((sum, p) => sum + p.price, 0) / properties.length,
        totalValue: properties.reduce((sum, p) => sum + p.price, 0),
        averageSize: properties.reduce((sum, p) => sum + p.size, 0) / properties.length
    };
    
    return stats;
}

// Initialize tooltips (simple implementation)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
}

// Refresh data (simulate API call)
function refreshData() {
    showNotification('Refreshing data...', 'info');
    
    // Simulate API delay
    setTimeout(() => {
        // In a real app, you would fetch from an API
        renderTable();
        showNotification('Data refreshed successfully!', 'success');
    }, 1000);
}

// Advanced search function
function advancedSearch(criteria) {
    let filtered = properties;
    
    if (criteria.name) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(criteria.name.toLowerCase())
        );
    }
    
    if (criteria.location) {
        filtered = filtered.filter(p => 
            p.location.toLowerCase().includes(criteria.location.toLowerCase())
        );
    }
    
    if (criteria.minPrice) {
        filtered = filtered.filter(p => p.price >= criteria.minPrice);
    }
    
    if (criteria.maxPrice) {
        filtered = filtered.filter(p => p.price <= criteria.maxPrice);
    }
    
    if (criteria.minSize) {
        filtered = filtered.filter(p => p.size >= criteria.minSize);
    }
    
    if (criteria.maxSize) {
        filtered = filtered.filter(p => p.size <= criteria.maxSize);
    }
    
    if (criteria.status) {
        filtered = filtered.filter(p => p.status === criteria.status);
    }
    
    if (criteria.owner) {
        filtered = filtered.filter(p => 
            p.owner.toLowerCase().includes(criteria.owner.toLowerCase())
        );
    }
    
    return filtered;
}

// Console helper functions for debugging
window.propertyHelpers = {
    getStats: getPropertyStatistics,
    exportCSV: exportPropertiesToCSV,
    refresh: refreshData,
    search: advancedSearch,
    properties: () => properties,
    filtered: () => filteredProperties
};

console.log('Properties module loaded successfully!');
console.log('Available helper functions:', Object.keys(window.propertyHelpers));
console.log('Use propertyHelpers.getStats() to view property statistics');