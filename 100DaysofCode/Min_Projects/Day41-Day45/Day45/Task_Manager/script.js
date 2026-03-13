// Get elements
const categorySelect = document.getElementById('category-select');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const board = document.querySelector('.board');
const content = document.getElementById('content');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date-input');
const assignToInput = document.getElementById('assign-to-input');
const filterPrioritySelect = document.getElementById('filter-priority-select');
const filterDueDateInput = document.getElementById('filter-due-date-input');

// Constants
const TASKS_API = 'https://task-data-api.herokuapp.com/tasks';
const CATEGORIES = ['weekday', 'family', 'walking', 'washing'];
const ERROR_MESSAGES = {
  TASK_INCOMPLETE: 'Please fill in all fields',
  TASK_SAVE_ERROR: 'Error saving task',
  TASK_LOAD_ERROR: 'Error loading tasks',
};

// Task data
let tasks = new Map();
let selectedCategory = '';

// Load tasks from API
async function loadTasks() {
  try {
    const response = await fetch(TASKS_API);
    const data = await response.json();
    data.forEach(task => {
      if (!tasks.has(task.category)) {
        tasks.set(task.category, []);
      }
      tasks.get(task.category).push(task);
    });
    renderTasks();
  } catch (error) {
    console.error(ERROR_MESSAGES.TASK_LOAD_ERROR, error);
  }
}

// Save tasks to API
async function saveTasks() {
  try {
    const taskList = [];
    tasks.forEach((taskList, category) => {
      taskList.forEach(task => {
        taskList.push({ category, ...task });
      });
    });
    const response = await fetch(TASKS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskList),
    });
    if (!response.ok) {
      throw new Error('Failed to save tasks');
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.TASK_SAVE_ERROR, error);
  }
}

// Validate task input
function validateTask(task) {
  if (!task.task || !task.priority || !task.dueDate || !task.assignTo) {
    showError(ERROR_MESSAGES.TASK_INCOMPLETE);
    return false;
  }
  return true;
}

// Show error message
function showError(message) {
  alert(message);
}

// Filter tasks
function filterTasks(category, filters = {}) {
  const taskList = tasks.get(category);
  if (!taskList) return [];
  return taskList.filter(task => {
    for (const key in filters) {
      if (task[key] !== filters[key]) return false;
    }
    return true;
  });
}

// Render tasks
function renderTasks() {
  board.innerHTML = '';
  tasks.forEach((taskList, category) => {
    if (selectedCategory && category !== selectedCategory) return;
    const list = document.createElement('div');
    list.classList.add('list', 'col-md-4');
    list.innerHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Tasks</h2>`;
    const filteredTasks = filterTasks(category, {
      priority: filterPrioritySelect.value,
      dueDate: filterDueDateInput.value,
    });
    filteredTasks.forEach((task, index) => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('card', 'mb-2');
      taskElement.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${task.task}</h5>
          <p>Priority: ${task.priority}</p>
          <p>Due Date: ${task.dueDate}</p>
          <p>Assigned to: ${task.assignTo}</p>
          <button class="btn btn-sm btn-danger delete-btn" data-category="${category}" data-index="${index}">Delete</button>
          <button class="btn btn-sm btn-primary edit-btn" data-category="${category}" data-index="${index}">Edit</button>
          <button class="btn btn-sm btn-info comment-btn" data-category="${category}" data-index="${index}">Comment</button>
          <button class="btn btn-sm btn-info attach-btn" data-category="${category}" data-index="${index}">Attach</button>
          <button class="btn btn-sm btn-info tag-btn" data-category="${category}" data-index="${index}">Tag</button>
        </div>
      `;
      list.appendChild(taskElement);
    });
    board.appendChild(list);
  });
}

// TaskManager class
class TaskManager {
  constructor() {
    this.tasks = tasks;
    this.selectedCategory = selectedCategory;
  }

  addTask(task) {
    if (validateTask(task) && this.selectedCategory) {
      if (!this.tasks.has(this.selectedCategory)) {
        this.tasks.set(this.selectedCategory, []);
      }
      this.tasks.get(this.selectedCategory).push(task);
      saveTasks();
      renderTasks();
      taskInput.value = '';
      prioritySelect.value = '';
      dueDateInput.value = '';
      assignToInput.value = '';
    }
  }
}

const taskManager = new TaskManager();

// Add task event listener
addTaskBtn.addEventListener('click', () => {
  const task = {
    task: taskInput.value.trim(),
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    assignTo: assignToInput.value,
    comments: [],
    attachments: [],
    tags: [],
  };
  taskManager.addTask(task);
});

// Filter tasks event listeners
filterPrioritySelect.addEventListener('change', renderTasks);
filterDueDateInput.addEventListener('change', renderTasks);

// Initialize
loadTasks();