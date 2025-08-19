let documents = [
    { id: 1, fileName: "Contract.pdf", property: "Sunset Villa", uploadedBy: "John Doe", date: "2025-08-01", type: "pdf" },
    { id: 2, fileName: "Proposal.docx", property: "Downtown Loft", uploadedBy: "Jane Smith", date: "2025-08-05", type: "docx" },
{ id: 3, fileName: "Budget.xlsx", property: "Riverside Condo", uploadedBy: "Alice Brown", date: "2025-08-10", type: "xlsx" },
{ id: 4, fileName: "Agreement.pdf", property: "Hilltop Estate", uploadedBy: "Bob Wilson", date: "2025-08-12", type: "pdf" },
    { id: 5, fileName: "Report.docx", property: "Beach House", uploadedBy: "Emma Davis", date: "2025-08-15", type: "docx" },
    { id: 6, fileName: "Inspection_Report.pdf", property: "Sunset Villa", uploadedBy: "Sarah Johnson", date: "2025-08-16", type: "pdf" },
    { id: 7, fileName: "Financial_Plan.xlsx", property: "Downtown Loft", uploadedBy: "Michael Lee", date: "2025-08-17", type: "xlsx" },
    { id: 8, fileName: "Terms_of_Sale.docx", property: "Riverside Condo", uploadedBy: "Lisa Taylor", date: "2025-08-18", type: "docx" },
    { id: 9, fileName: "Appraisal.pdf", property: "Beach House", uploadedBy: "David Clark", date: "2025-08-19", type: "pdf" },
    { id: 10, fileName: "Marketing_Plan.docx", property: "Hilltop Estate", uploadedBy: "Emily White", date: "2025-08-19", type: "docx" }
];

function renderTable(filteredDocs = documents) {
    const tableBody = document.getElementById('docsTable');
    tableBody.innerHTML = '';

filteredDocs.forEach(doc => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="p-3">${doc.fileName}</td>
        <td class="p-3">${doc.property}</td>
        <td class="p-3">${doc.uploadedBy}</td>
        <td class="p-3">${doc.date}</td>
        <td class="p-3">
            <button class="text-blue-600 hover:underline" onclick="downloadDoc(${doc.id})">Download</button>
            <button class="text-red-600 hover:underline ml-2" onclick="deleteDoc(${doc.id})">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
});
}

function filterDocuments() {
    const propertyFilter = document.getElementById('propertyFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;

    let filteredDocs = documents;

    if (propertyFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.property.toLowerCase().includes(propertyFilter));
    }

    if (typeFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.type === typeFilter);
    }

    renderTable(filteredDocs);
}

function openModal() {
    document.getElementById('uploadDocModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('uploadDocModal').classList.add('hidden');
    document.getElementById('modalFileInput').value = '';
    document.getElementById('modalProperty').value = 'Sunset Villa';
}

function saveUpload() {
    const fileInput = document.getElementById('modalFileInput');
    const property = document.getElementById('modalProperty').value;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = file.name;
        const fileType = fileName.split('.').pop().toLowerCase();

        if (['pdf', 'docx', 'xlsx'].includes(fileType)) {
            const newDoc = {
                id: documents.length + 1,
                fileName,
                property,
                uploadedBy: "Current User", // Simulated user
                date: new Date().toISOString().split('T')[0],
                type: fileType
            };
            documents.push(newDoc);
            renderTable();
            closeModal();
        } else {
            alert('Please upload a PDF, DOCX, or XLSX file.');
        }
    } else {
        alert('Please select a file to upload.');
    }
}

function downloadDoc(id) {
    const doc = documents.find(doc => doc.id === id);
    if (doc) {
        alert(`Simulating download of ${doc.fileName}`);
        // In a real app, this would trigger an actual file download
    }
}

function deleteDoc(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        documents = documents.filter(doc => doc.id !== id);
        renderTable();
    }
}

document.getElementById('uploadDocBtn').addEventListener('click', openModal);
document.getElementById('cancelUploadBtn').addEventListener('click', closeModal);
document.getElementById('saveUploadBtn').addEventListener('click', saveUpload);
document.getElementById('propertyFilter').addEventListener('input', filterDocuments);
document.getElementById('typeFilter').addEventListener('change', filterDocuments);

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});