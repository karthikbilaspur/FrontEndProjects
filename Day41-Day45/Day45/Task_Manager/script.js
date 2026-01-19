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

// Task data
const tasks = new Map();
let selectedCategory = '';

// Fetch tasks from JSON file
async function fetchTasks() {
  try {
    const response = await fetch('tasks.json');
    const data = await response.json();
    data.tasks.forEach(task => {
      if (!tasks.has(task.category)) {
        tasks.set(task.category, []);
      }
      tasks.get(task.category).push(task);
    });
    renderTasks();
  } catch (error) {
    console.error(error);
  }
}

// Render tasks
function renderTasks() {
  board.innerHTML = '';
  tasks.forEach((taskList, category) => {
    if (selectedCategory && category !== selectedCategory) return;
    const list = document.createElement('div');
    list.classList.add('list', 'col-md-4');
    list.innerHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Tasks</h2>`;
    taskList.forEach((task, index) => {
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

// Add task event listener
addTaskBtn.addEventListener('click', async () => {
  const taskName = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;
  const assignTo = assignToInput.value;
  if (taskName && selectedCategory) {
    if (!tasks.has(selectedCategory)) {
      tasks.set(selectedCategory, []);
    }
    tasks.get(selectedCategory).push({ task: taskName, priority, dueDate, assignTo, comments: [], attachments: [], tags: [] });
    taskInput.value = '';
    prioritySelect.value = '';
    dueDateInput.value = '';
    assignToInput.value = '';
    await saveTasks();
    renderTasks();
  }
});

// Filter tasks
filterPrioritySelect.addEventListener('change', () => {
  const priority = filterPrioritySelect.value;
  const filteredTasks = tasks;
  tasks.forEach((taskList, category) => {
    taskList.forEach((task, index) => {
      if (priority && task.priority !== priority) {
        taskList.splice(index, 1);
      }
    });
  });
  renderTasks();
});

filterDueDateInput.addEventListener('change', () => {
  const dueDate = filterDueDateInput.value;
  const filteredTasks = tasks;
  tasks.forEach((taskList, category) => {
    taskList.forEach((task, index) => {
      if (dueDate && task.dueDate !== dueDate) {
        taskList.splice(index, 1);
      }
    });
  });
  renderTasks();
});

// Comment task event listener
board.addEventListener('click', async (e) => {
  if (e.target.classList.contains('comment-btn')) {
    const category = e.target.dataset.category;
    const index = e.target.dataset.index;
    const comment = prompt('Enter comment:');
    if (comment) {
      tasks.get(category)[index].comments.push(comment);
      await saveTasks();
      renderTasks();
    }
  }
});

// Attach task event listener
board.addEventListener('click', async (e) => {
  if (e.target.classList.contains('attach-btn')) {
    const category = e.target.dataset.category;
    const index = e.target.dataset.index;
    const attachment = prompt('Enter attachment:');
    if (attachment) {
      tasks.get(category)[index].attachments.push(attachment);
      await saveTasks();
      renderTasks();
    }
  }
});

// Tag task event listener
board.addEventListener('click', async (e) => {
  if (e.target.classList.contains('tag-btn')) {
    const category = e.target.dataset.category;
    const index = e.target.dataset.index;
    const tag = prompt('Enter tag:');
    if (tag) {
      tasks.get(category)[index].tags.push(tag);
      await saveTasks();
      renderTasks();
    }
  }
});

// Save tasks to JSON file
async function saveTasks() {
  try {
    const taskList = [];
    tasks.forEach((taskList, category) => {
      taskList.forEach(task => {
        taskList.push({ category, ...task });
      });
    });
    const response = await fetch('tasks.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: taskList }),
    });
    if (!response.ok) {
      throw new Error('Failed to save tasks');
    }
  } catch (error) {
    console.error(error);
  }
}

// Initialize
fetchTasks();