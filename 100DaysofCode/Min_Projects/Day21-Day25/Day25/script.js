const coursesPerPage = 4;
const courseContainer = document.getElementById('course-container');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const languageDropdown = document.getElementById('languageDropdown');

let courses = [];
let filteredCourses = [];
let currentPage = 1;
let totalPages = 1;
let currentLanguage = 'English';
let translations = {
    'English': {
        'Backend': 'Backend',
        'Frontend': 'Frontend',
        'Fullstack': 'Fullstack',
        'Search courses...': 'Search courses...',
        'Sort by Title': 'Sort by Title',
        'Sort by Category': 'Sort by Category',
        'All Categories': 'All Categories'
    },
    'Spanish': {
        'Backend': 'Backend',
        'Frontend': 'Frontend',
        'Fullstack': 'Fullstack',
        'Search courses...': 'Buscar cursos...',
        'Sort by Title': 'Ordenar por título',
        'Sort by Category': 'Ordenar por categoría',
        'All Categories': 'Todas las categorías'
    },
    'French': {
        'Backend': 'Backend',
        'Frontend': 'Frontend',
        'Fullstack': 'Fullstack',
        'Search courses...': 'Rechercher des cours...',
        'Sort by Title': 'Trier par titre',
        'Sort by Category': 'Trier par catégorie',
        'All Categories': 'Toutes les catégories'
    }
};

// Load courses data
fetch('backend.json')
    .then(response => response.json())
    .then(data => {
        courses = courses.concat(data);
        fetch('frontend.json')
            .then(response => response.json())
            .then(data => {
                courses = courses.concat(data);
                fetch('fullstack.json')
                    .then(response => response.json())
                    .then(data => {
                        courses = courses.concat(data);
                        filteredCourses = courses;
                        displayCourses(currentPage);
                        updatePagination();
                        updateTranslations();
                    });
            });
    })
    .catch(error => console.error('Error loading courses:', error));

// Display courses
function displayCourses(page) {
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const coursesToDisplay = filteredCourses.slice(startIndex, endIndex);

    courseContainer.innerHTML = '';

    coursesToDisplay.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('col-md-3', 'course-card', 'animate-fade-in');
        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
        `;
        courseContainer.appendChild(courseCard);
    });
}

// Update pagination
function updatePagination() {
    totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.classList.toggle('active', i === currentPage);
        link.addEventListener('click', () => {
            currentPage = i;
            displayCourses(currentPage);
            updatePagination();
        });
        pagination.appendChild(link);
    }
}

// Search and filter courses
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();
    filteredCourses = courses.filter(course => course.title.toLowerCase().includes(searchQuery) || course.description.toLowerCase().includes(searchQuery));
    currentPage = 1;
    displayCourses(currentPage);
    updatePagination();
});

categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    if (category === 'all') {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => course.category === category);
    }
    currentPage = 1;
    displayCourses(currentPage);
    updatePagination();
});

sortFilter.addEventListener('change', () => {
    const sortBy = sortFilter.value;
    if (sortBy === 'title') {
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
        filteredCourses.sort((a, b) => a.category.localeCompare(b.category));
    }
    currentPage = 1;
    displayCourses(currentPage);
    updatePagination();
});

// Language dropdown
languageDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        currentLanguage = e.target.textContent;
        languageDropdown.innerHTML = `<i class="fa-solid fa-language"></i> ${currentLanguage}`;
        updateTranslations();
    }
});

// Update translations
function updateTranslations() {
    searchInput.placeholder = translations[currentLanguage]['Search courses...'];
    categoryFilter.options[0].text = translations[currentLanguage]['All Categories'];
    categoryFilter.options[1].text = translations[currentLanguage]['Backend'];
    categoryFilter.options[2].text = translations[currentLanguage]['Frontend'];
    categoryFilter.options[3].text = translations[currentLanguage]['Fullstack'];
    sortFilter.options[0].text = translations[currentLanguage]['Sort by Title'];
    sortFilter.options[1].text = translations[currentLanguage]['Sort by Category'];
}