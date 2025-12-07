let taskList = document.getElementById('task-list');
let taskInput = document.getElementById('task-input');
let prioritySelect = document.getElementById('priority-select');
let dueDateInput = document.getElementById('due-date-input');
let addTaskBtn = document.getElementById('add-task-btn');
let tasks = [];

loadTasks();

addTaskBtn.addEventListener('click', addTask);

function addTask() {
  let taskText = taskInput.value.trim();
  let priority = prioritySelect.value;
  let dueDate = dueDateInput.value;
  if (taskText !== '') {
    tasks.push({ text: taskText, done: false, priority: priority, dueDate: dueDate, date: new Date() });
    taskInput.value = '';
    prioritySelect.value = 'low';
    dueDateInput.value = '';
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    let taskElement = document.createElement('li');
    taskElement.classList.add('task', 'list-group-item');
    if (task.done) {
      taskElement.classList.add('done');
    }
    taskElement.innerHTML = `
      <span>${task.text} (Priority: ${task.priority}, Due Date: ${task.dueDate})</span>
      <button class="remove-task-btn btn btn-sm btn-danger float-right" onclick="removeTask(${index})">Remove</button>
      <button class="mark-done-btn btn btn-sm btn-success float-right mr-2" onclick="markAsDone(${index})">${task.done ? 'Unmark' : 'Mark as Done'}</button>
      <button class="edit-task-btn btn btn-sm btn-info float-right mr-2" onclick="editTask(${index})">Edit</button>
    `;
    taskList.appendChild(taskElement);
  });
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function markAsDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  let taskText = prompt('Enter new task text:');
  let priority = prompt('Enter new priority (low, medium, high):');
  let dueDate = prompt('Enter new due date:');
  if (taskText && priority && dueDate) {
    tasks[index].text = taskText;
    tasks[index].priority = priority;
    tasks[index].dueDate = dueDate;
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  let storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}