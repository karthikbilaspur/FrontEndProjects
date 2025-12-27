const csvInput = document.getElementById('csv');
const exportButton = document.getElementById('btn');
const table = document.getElementById('table');
const errorMsg = document.getElementById('error-msg');
let csvData = [];

csvInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            csvData = parseCSV(content);
            populateTable(csvData);
            exportButton.style.display = 'block';
            csvInput.style.display = 'none';
            errorMsg.textContent = '';
        } catch (error) {
            errorMsg.textContent = 'Error parsing CSV file';
            console.error(error);
        }
    };
    reader.onerror = () => {
        errorMsg.textContent = 'Error reading file';
    };
    reader.readAsText(file);
}

function parseCSV(content) {
    const rows = content.split('\n')
        .map(row => row.split(',').map(cell => cell.trim()));
    return rows;
}

function populateTable(data) {
    table.innerHTML = '';
    data.forEach((row) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

exportButton.addEventListener('click', exportData);

function exportData() {
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}