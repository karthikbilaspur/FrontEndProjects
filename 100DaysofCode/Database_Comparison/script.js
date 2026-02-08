// JavaScript
const databases = [
    {
        name: 'MySQL',
        description: 'Popular open-source relational database',
        type: 'Relational',
        strengths: 'Maturity, wide adoption, easy to use',
        weaknesses: 'Limited scalability, not ideal for complex queries',
        useCases: 'Web applications, blogs, small-scale projects'
    },
    {
        name: 'PostgreSQL',
        description: 'Powerful, open-source relational database',
        type: 'Relational',
        strengths: 'ACID compliance, scalability, advanced data types',
        weaknesses: 'Steeper learning curve, resource-intensive',
        useCases: 'Complex applications, data analytics, enterprise projects'
    },
    {
        name: 'Oracle',
        description: 'Commercial relational database with advanced features',
        type: 'Relational',
        strengths: 'High performance, security, scalability',
        weaknesses: 'Expensive, complex setup, resource-intensive',
        useCases: 'Enterprise applications, large-scale projects, financial systems'
    },
    {
        name: 'SQL Server',
        description: 'Microsoft\'s relational database with robust features',
        type: 'Relational',
        strengths: 'Integration with Microsoft tools, high performance, security',
        weaknesses: 'Windows-centric, expensive, resource-intensive',
        useCases: 'Windows-based applications, enterprise projects, business intelligence'
    },
    {
        name: 'MariaDB',
        description: 'Open-source relational database, fork of MySQL',
        type: 'Relational',
        strengths: 'Compatibility with MySQL, improved performance, security',
        weaknesses: 'Limited support for advanced features, compatibility issues',
        useCases: 'Web applications, small-scale projects, MySQL migration'
    },
    {
        name: 'Neo4j',
        description: 'Graph database optimized for complex relationships',
        type: 'Graph',
        strengths: 'High performance, scalability, advanced querying',
        weaknesses: 'Steeper learning curve, limited support for transactions',
        useCases: 'Social networks, recommendation engines, knowledge graphs'
    },
    {
        name: 'Amazon Neptune',
        description: 'Graph database service for complex relationships',
        type: 'Graph',
        strengths: 'Highly scalable, fully managed, integrates with AWS',
        weaknesses: 'Limited support for advanced querying, expensive',
        useCases: 'Real-time applications, IoT, knowledge graphs'
    },
    {
        name: 'ArangoDB',
        description: 'Multi-model database with graph capabilities',
        type: 'Graph',
        strengths: 'Flexible data model, high performance, scalable',
        weaknesses: 'Limited support for advanced querying, complex setup',
        useCases: 'Real-time applications, IoT, recommendation engines'
    },
    {
        name: 'InfluxDB',
        description: 'Time-series database for large amounts of data',
        type: 'Time-series',
        strengths: 'High performance, scalable, integrates with Grafana',
        weaknesses: 'Limited support for advanced querying, resource-intensive',
        useCases: 'Monitoring, IoT, analytics'
    },
    {
        name: 'OpenTSDB',
        description: 'Time-series database for large amounts of data',
        type: 'Time-series',
        strengths: 'Scalable, high performance, integrates with Hadoop',
        weaknesses: 'Limited support for advanced querying, complex setup',
        useCases: 'Monitoring, IoT, analytics'
    },
    {
        name: 'TimescaleDB',
        description: 'Time-series database built on PostgreSQL',
        type: 'Time-series',
        strengths: 'High performance, scalable, integrates with PostgreSQL',
        weaknesses: 'Limited support for advanced querying, resource-intensive',
        useCases: 'Monitoring, IoT, analytics'
    },
    {
        name: 'MongoDB',
        description: 'NoSQL document-based database',
        type: 'Document',
        strengths: 'Flexible schema, high scalability, easy data retrieval',
        weaknesses: 'Limited support for transactions, data consistency',
        useCases: 'Big data, real-time applications, content management'
    },
    {
        name: 'Couchbase',
        description: 'NoSQL document-based database',
        type: 'Document',
        strengths: 'High performance, scalable, easy data retrieval',
        weaknesses: 'Limited support for advanced querying, resource-intensive',
        useCases: 'Real-time applications, IoT, content management'
    },
    {
        name: 'CouchDB',
        description: 'NoSQL document-based database',
        type: 'Document',
        strengths: 'Flexible schema, high scalability, easy data retrieval',
        weaknesses: 'Limited support for advanced querying, data consistency',
        useCases: 'Big data, real-time applications, content management'
    }
];

let filteredDatabases = [...databases];

const accordion = document.getElementById('databaseAccordion');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const sortBy = document.getElementById('sortBy');
const paginationContainer = document.getElementById('paginationContainer');
const recommendForm = document.getElementById('recommend-form');
const recommendationResult = document.getElementById('recommendation-result');
const db1Select = document.getElementById('db1-select');
const db2Select = document.getElementById('db2-select');
const compareBtn = document.getElementById('compare-btn');
const comparisonResult = document.getElementById('comparison-result');
const comparisonWarning = document.getElementById('comparison-warning');

let currentPage = 1;
const itemsPerPage = 3;

function createAccordionItem(database, index) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${index}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
                    ${database.name}
                </button>
            </h2>
            <div id="collapse-${index}" class="accordion-collapse collapse show" aria-labelledby="heading-${index}" data-bs-parent="#databaseAccordion">
                <div class="accordion-body">
                    <p>Description: ${database.description}</p>
                    <p>Type: ${database.type}</p>
                    <p>Strengths: ${database.strengths}</p>
                    <p>Weaknesses: ${database.weaknesses}</p>
                    <p>Use Cases: ${database.useCases}</p>
                </div>
            </div>
        </div>
    `;
}

function renderAccordion() {
    accordion.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedDatabases = filteredDatabases.slice(start, end);

    if (paginatedDatabases.length === 0) {
        accordion.innerHTML = '<p>No results found.</p>';
        return;
    }

    paginatedDatabases.forEach((database, index) => {
        accordion.innerHTML += createAccordionItem(database, index);
    });
}

function renderPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(filteredDatabases.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderAccordion();
        });
        paginationContainer.appendChild(pageButton);
    }
}

function filterDatabases() {
    const searchQuery = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    filteredDatabases = databases.filter(database => {
        const matchesSearch = database.name.toLowerCase().includes(searchQuery) || database.description.toLowerCase().includes(searchQuery);
        const matchesType = type === '' || database.type === type;
        return matchesSearch && matchesType;
    });
    currentPage = 1;
    renderAccordion();
    renderPagination();
}

function sortDatabases() {
    const sortByValue = sortBy.value;
    filteredDatabases.sort((a, b) => {
        if (sortByValue === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortByValue === 'type') {
            return a.type.localeCompare(b.type);
        }
    });
    renderAccordion();
}

let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterDatabases, 300);
});
typeFilter.addEventListener('change', filterDatabases);
sortBy.addEventListener('change', sortDatabases);

function recommendDatabase(useCase, dataSize) {
    let recommendedDatabase = null;
    let maxScore = 0;
    databases.forEach((database) => {
        let score = 0;
        if (database.useCases.includes(useCase)) {
            score += 1;
        }
        if (database.strengths.includes(dataSize)) {
            score += 1;
        }
        if (score > maxScore) {
            maxScore = score;
            recommendedDatabase = database;
        }
    });
    return recommendedDatabase;
}

recommendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const useCase = document.getElementById('use-case').value;
    const dataSize = document.getElementById('data-size').value;
    const recommendedDatabase = recommendDatabase(useCase, dataSize);
    if (recommendedDatabase) {
        recommendationResult.innerHTML = `
            <h2>Recommended Database: ${recommendedDatabase.name}</h2>
            <p>${recommendedDatabase.description}</p>
        `;
    } else {
        recommendationResult.innerHTML = '<p>No database recommended.</p>';
    }
});

databases.forEach((db) => {
    const option1 = document.createElement('option');
    option1.value = db.name;
    option1.text = db.name;
    db1Select.add(option1);

    const option2 = document.createElement('option');
    option2.value = db.name;
    option2.text = db.name;
    db2Select.add(option2);
});

compareBtn.addEventListener('click', () => {
    const db1Name = db1Select.value;
    const db2Name = db2Select.value;

    if (db1Name === db2Name) {
        comparisonWarning.innerHTML = 'You cannot select the same database from both boxes. Please select different databases.';
        comparisonResult.innerHTML = '';
    } else if (db1Name && db2Name) {
        comparisonWarning.innerHTML = '';
        const db1 = databases.find((db) => db.name === db1Name);
        const db2 = databases.find((db) => db.name === db2Name);

        const comparisonResultHTML = compareDatabases(db1, db2);
        comparisonResult.innerHTML = comparisonResultHTML;
    } else {
        alert('Please select two databases to compare.');
    }
});

function compareDatabases(db1, db2) {
    let comparisonResult = '';

    comparisonResult += `<h3>${db1.name} vs ${db2.name}</h3>`;
    comparisonResult += `<p>Type: ${db1.type} vs ${db2.type}</p>`;
    comparisonResult += `<p>Description: ${db1.description} vs ${db2.description}</p>`;
    comparisonResult += `<p>Strengths: ${db1.strengths} vs ${db2.strengths}</p>`;
    comparisonResult += `<p>Weaknesses: ${db1.weaknesses} vs ${db2.weaknesses}</p>`;
    comparisonResult += `<p>Use Cases: ${db1.useCases} vs ${db2.useCases}</p>`;

    return comparisonResult;
}

        let currentIndex = 0;
        const carousel = document.getElementById('carousel');
        const cards = document.querySelectorAll('.card');
        const cardWidth = cards[0].offsetWidth + 40; // including margin

        function nextCard() {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }

        function prevCard() {
            if (currentIndex > 0) {
                currentIndex--;
                carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        }


renderAccordion();
renderPagination();