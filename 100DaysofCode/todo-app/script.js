let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let calendar;
let timers = {};

// Function to get priority color
function getPriorityColor(priority) {
    return priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green';
}

// Function to get priority text class
function getPriorityTextClass(priority) {
    return priority === 'high' ? 'text-danger' : priority === 'medium' ? 'text-warning' : '';
}

// Function to render tasks
function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const taskHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}">
                <span class="${getPriorityTextClass(task.priority)}">${task.text}</span>
                <div>
                    <select class="priority-select" data-index="${index}">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                    <button class="btn btn-sm btn-info edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                    <button class="btn btn-sm btn-success start-timer-btn" data-index="${index}">Start</button>
                    <button class="btn btn-sm btn-warning pause-timer-btn" data-index="${index}">Pause</button>
                    <button class="btn btn-sm btn-check complete-btn" data-index="${index}">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                    <span>Time: ${task.timer} seconds</span>
                </div>
            </li>
        `;
        taskList.insertAdjacentHTML('beforeend', taskHTML);
    });
}

// Function to update calendar events
function updateCalendar() {
    calendar.getEvents().forEach((event) => event.remove());
    tasks.forEach((task, index) => {
        calendar.addEvent({
            title: task.text,
            start: task.dueDate,
            end: task.dueDate,
            backgroundColor: getPriorityColor(task.priority),
            borderColor: getPriorityColor(task.priority),
            description: `Priority: ${task.priority}, Timer: ${task.timer} seconds`,
        });
    });
}

// Function to render the calendar
function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: tasks.map((task, index) => ({
            title: task.text,
            start: task.dueDate,
            end: task.dueDate,
            backgroundColor: getPriorityColor(task.priority),
            borderColor: getPriorityColor(task.priority),
            description: `Priority: ${task.priority}, Timer: ${task.timer} seconds`,
        })),
    });
    calendar.render();
}

// Function to sort tasks
function sortTasks(sortBy) {
    if (sortBy === 'priority') {
        tasks.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            if (a.priority === 'medium' && b.priority === 'low') return -1;
            if (a.priority === 'low' && b.priority === 'medium') return 1;
            return 0;
        });
    } else if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    renderTasks();
}

// Function to filter tasks
function filterTasks(filterBy) {
    if (filterBy === 'all') {
        renderTasks(tasks);
    } else {
        const filteredTasks = tasks.filter((task) => task.priority === filterBy);
        renderTasks(filteredTasks);
    }
}

// Add event listener to due date input
document.getElementById('due-date-input').addEventListener('change', (e) => {
    const dueDate = new Date(e.target.value);
    const dueTimeInput = document.getElementById('due-time-input');
    dueTimeInput.style.display = 'block';
    const dueDaySpan = document.getElementById('due-day');
    dueDaySpan.innerText = getDayOfWeek(dueDate);
});

// Function to get day of week
function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// Event listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-btn')) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    } else if (e.target.classList.contains('filter-btn')) {
        const priority = e.target.dataset.priority;
        filterTasks(priority);
    } else if (e.target.classList.contains('sort-btn')) {
        const sortBy = e.target.dataset.sort;
        sortTasks(sortBy);
    } else if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateCalendar();
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const index = e.target.dataset.index;
        const newText = prompt('Enter new task text:', tasks[index].text);
        if (newText !== null) {
            tasks[index].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateCalendar();
        }
    } else if (e.target.classList.contains('start-timer-btn')) {
        const index = e.target.dataset.index;
        startTimer(index);
    } else if (e.target.classList.contains('pause-timer-btn')) {
        const index = e.target.dataset.index;
        stopTimer(index);
    } else if (e.target.classList.contains('save-csv-btn')) {
        saveToCSV();
    } else if (e.target.classList.contains('save-excel-btn')) {
        saveToExcel();
    } else if (e.target.classList.contains('save-pdf-btn')) {
        saveToPDF();
    } else if (e.target.classList.contains('reset-btn')) {
        resetTasks();
    } else if (e.target.classList.contains('share-btn')) {
        shareTasks();
    }
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('priority-select')) {
        const index = e.target.dataset.index;
        tasks[index].priority = e.target.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateCalendar();
    }
});

document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    const dueDateInput = document.getElementById('due-date-input');
    const dueDate = new Date(dueDateInput.value);
    if (taskText !== '' && dueDate > new Date()) {
        tasks.push({ text: taskText, priority: 'low', timer: 0, history: [], dueDate: dueDate, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        renderCalendar();
        taskInput.value = '';
        dueDateInput.value = '';
    } else {
        alert('Please enter a valid task and due date!');
    }
});

// Function to start timer
function startTimer(index) {
    timers[index] = setInterval(() => {
        tasks[index].timer++;
        tasks[index].history.push({ date: new Date(), time: tasks[index].timer });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }, 1000);
}

// Function to stop timer
function stopTimer(index) {
    clearInterval(timers[index]);
}

// Function to reset tasks
function resetTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateCalendar();
    }
}

// Function to save to CSV
function saveToCSV() {
    try {
        const csv = Papa.unparse(tasks);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tasks.csv';
        link.click();
    } catch (error) {
        alert('Error saving to CSV: ' + error.message);
        console.error(error);
    }
}

// Function to save to Excel
function saveToExcel() {
    try {
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
        XLSX.writeFile(workbook, 'tasks.xlsx');
    } catch (error) {
        alert('Error saving to Excel: ' + error.message);
        console.error(error);
    }
}

// Function to save to PDF
function saveToPDF() {
    try {
        const doc = new jspdf.jsPDF();
        doc.text('Tasks', 10, 10);
        tasks.forEach((task, index) => {
            doc.text(`${index + 1}. ${task.text} (${task.priority})`, 10, 20 + (index * 10));
        });
        doc.save('tasks.pdf');
    } catch (error) {
        alert('Error saving to PDF: ' + error.message);
        console.error(error);
    }
}

// Function to share tasks
function shareTasks() {
    const tasksText = tasks.map((task) => `${task.text} - ${task.priority} - ${task.dueDate}`).join('\n');
    const shareData = {
        title: 'To-Do List',
        text: tasksText,
        url: window.location.href,
    };
    navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
}

// Initial render
renderTasks();
renderCalendar();