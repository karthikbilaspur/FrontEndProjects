const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Get elements
const form = document.getElementById('employee-form');
const addButton = document.getElementById('add-btn');
const employeeData = document.getElementById('employee-data');
const departmentFilter = document.getElementById('department-filter');
const locationFilter = document.getElementById('location-filter');
const dashboard = document.getElementById('dashboard');

// Employee data
let employees = [];

// Fetch employees from API
async function fetchEmployees() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        employees = data.map((employee) => ({
            id: employee.id,
            name: employee.title,
            position: 'Developer',
            salary: Math.floor(Math.random() * 100000),
            department: getRandomDepartment(),
            location: getRandomLocation(),
        }));
        displayEmployees(employees);
        updateDashboard(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        toastr.error('Error fetching employees');
    }
}

// Add employee
async function addEmployee(name, position, salary, department, location) {
    try {
        const response = await axios.post(API_URL, {
            title: name,
            body: position,
        });
        const data = response.data;
        const employee = { id: data.id, name, position, salary, department, location };
        employees.push(employee);
        displayEmployees(employees);
        updateDashboard(employees);
        toastr.success(`Employee ${name} added`);
        return employee;
    } catch (error) {
        console.error('Error adding employee:', error);
        toastr.error('Error adding employee');
        return null;
    }
}

// Display employees
function displayEmployees(employees) {
    employeeData.innerHTML = '';
    employees.forEach((employee) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${employee.department}</td>
            <td>${employee.location}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewEmployee(${employee.id})">View</button>
                <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        employeeData.appendChild(row);
    });
}

// Update dashboard
function updateDashboard(employees) {
    const totalEmployees = employees.length;
    const departments = _.groupBy(employees, 'department');
    const locations = _.groupBy(employees, 'location');
    dashboard.innerHTML = `
        <h2>Dashboard</h2>
        <p>Total Employees: ${totalEmployees}</p>
        <p>Departments: ${Object.keys(departments).length}</p>
        <p>Locations: ${Object.keys(locations).length}</p>
        <canvas id="department-chart"></canvas>
        <canvas id="location-chart"></canvas>
    `;
    const departmentChart = document.getElementById('department-chart').getContext('2d');
    const locationChart = document.getElementById('location-chart').getContext('2d');
    new Chart(departmentChart, {
        type: 'bar',
        data: {
            labels: Object.keys(departments),
            datasets: [{
                label: 'Employees',
                data: Object.values(departments).map((department) => department.length),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    new Chart(locationChart, {
        type: 'bar',
        data: {
            labels: Object.keys(locations),
            datasets: [{
                label: 'Employees',
                data: Object.values(locations).map((location) => location.length),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// View employee
function viewEmployee(id) {
    const employee = employees.find((employee) => employee.id === id);
    if (employee) {
        Swal.fire({
            title: `Employee Details`,
            html: `
                <p>Name: ${employee.name}</p>
                <p>Position: ${employee.position}</p>
                <p>Salary: ${employee.salary}</p>
                <p>Department: ${employee.department}</p>
                <p>Location: ${employee.location}</p>
            `,
        });
    }
}

// Edit employee
async function editEmployee(id) {
    const employee = employees.find((employee) => employee.id === id);
    if (employee) {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Employee',
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${employee.name}">
                <input id="position" class="swal2-input" placeholder="Position" value="${employee.position}">
                <input id="salary" class="swal2-input" placeholder="Salary" value="${employee.salary}">
                <input id="department" class="swal2-input" placeholder="Department" value="${employee.department}">
                <input id="location" class="swal2-input" placeholder="Location" value="${employee.location}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('name').value,
                    position: document.getElementById('position').value,
                    salary: document.getElementById('salary').value,
                    department: document.getElementById('department').value,
                    location: document.getElementById('location').value,
                };
            },
        });
        if (formValues) {
            employee.name = formValues.name;
            employee.position = formValues.position;
            employee.salary = formValues.salary;
            employee.department = formValues.department;
            employee.location = formValues.location;
            displayEmployees(employees);
            updateDashboard(employees);
            toastr.success(`Employee ${employee.name} updated`);
        }
    }
}

// Delete employee
async function deleteEmployee(id) {
    const employee = employees.find((employee) => employee.id === id);
    if (employee) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            employees = employees.filter((employee) => employee.id !== id);
            displayEmployees(employees);
            updateDashboard(employees);
            toastr.success(`Employee ${employee.name} deleted`);
        }
    }
}

// Filter employees
function filterEmployees(department, location) {
    let filteredEmployees = employees;
    if (department) {
        filteredEmployees = filteredEmployees.filter((employee) => employee.department === department);
    }
    if (location) {
        filteredEmployees = filteredEmployees.filter((employee) => employee.location === location);
    }
    displayEmployees(filteredEmployees);
}

// Get random department
function getRandomDepartment() {
    const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];
    return departments[Math.floor(Math.random() * departments.length)];
}

// Get random location
function getRandomLocation() {
    const locations = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'];
    return locations[Math.floor(Math.random() * locations.length)];
}

// Initialize
async function init() {
    await fetchEmployees();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const salary = document.getElementById('salary').value;
        const department = getRandomDepartment();
        const location = getRandomLocation();
        await addEmployee(name, position, salary, department, location);
        form.reset();
    });

    departmentFilter.addEventListener('change', (e) => {
        filterEmployees(e.target.value, locationFilter.value);
    });

    locationFilter.addEventListener('change', (e) => {
        filterEmployees(departmentFilter.value, e.target.value);
    });
}

init();