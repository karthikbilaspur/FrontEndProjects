// Configuration
const listsData = [
  { id: "list1", title: "To Do", tasks: [] },
  { id: "list2", title: "In Progress", tasks: [] },
  { id: "list3", title: "Done", tasks: [] },
];

const jsonFiles = [
  "washing_task.json",
  "walking_task.json",
  "weekday_task.json",
  "family_task.json",
];

// Define constants for list titles
const LIST_TITLES = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

// Get elements
function getElements() {
  return {
    board: document.querySelector(".board"),
    taskInput: document.getElementById("task-input"),
    addTaskBtn: document.getElementById("add-task-btn"),
    clearAllBtn: document.querySelector("#clear-all-btn"),
    taskSelect: document.getElementById("task-select"),
    homeLink: document.getElementById("home-link"),
    aboutLink: document.getElementById("about-link"),
    contactLink: document.getElementById("contact-link"),
    content: document.getElementById("content"),
  };
}

// Add drag event listeners
function addDragEventListeners() {
  const cards = document.querySelectorAll(".card");
  const lists = document.querySelectorAll(".list");

  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
  });
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {
  console.log("Drag ended");
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add("over");
}

function dragLeave(e) {
  this.classList.remove("over");
}

function dragDrop(e) {
  const id = e.dataTransfer.getData("text/plain");
  const card = document.getElementById(id);
  this.appendChild(card);
  this.classList.remove("over");
  updateListsData();
}

// Task manager
let selectedJsonFile = '';
let tasksData = [];

function renderLists(tasks) {
  const board = getElements().board;
  board.innerHTML = "";
  listsData.forEach((list) => {
    const listElement = document.createElement("div");
    listElement.classList.add("list", "col-md-4");
    listElement.id = list.id;
    listElement.innerHTML = `<h2>${list.title}</h2>`;
    tasks.forEach((task, index) => {
      if (task.list === list.title) {
        const taskElement = document.createElement("div");
        taskElement.classList.add("card", "mb-2");
        taskElement.draggable = true;
        taskElement.id = `task-${list.id}-${index}`;
        taskElement.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
            <button class="btn btn-sm btn-primary share-btn" data-index="${index}">Share</button>
          </div>
        `;
        listElement.appendChild(taskElement);
      }
    });
    board.appendChild(listElement);
  });
  addDragEventListeners();
  addDeleteEventListeners();
  addShareEventListeners();
}

function addDeleteEventListeners() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", deleteTask);
  });
}

function addShareEventListeners() {
  const shareBtns = document.querySelectorAll(".share-btn");
  shareBtns.forEach((btn) => {
    btn.addEventListener("click", shareTask);
  });
}

function addTask() {
  const taskName = getElements().taskInput.value.trim();
  if (taskName && selectedJsonFile) {
    tasksData.push({ title: taskName, list: listsData[0].title });
    getElements().taskInput.value = "";
    renderLists(tasksData);
  }
}

function deleteTask(e) {
  const index = e.target.dataset.index;
  tasksData.splice(index, 1);
  renderLists(tasksData);
}

function shareTask(e) {
  const index = e.target.dataset.index;
  const task = tasksData[index];
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(task.title)}`;
  window.open(shareUrl, '_blank');
}

function clearAllTasks() {
  tasksData = [];
  renderLists(tasksData);
}

function updateListsData() {
  listsData.forEach((list) => {
    list.tasks = [];
    const tasks = list.element = document.querySelectorAll(`#${list.id} .card`);
    tasks.forEach((task) => {
      list.tasks.push({ title: task.querySelector(".card-title").textContent });
    });
  });
}

function fetchTasks() {
  if (selectedJsonFile) {
    fetch(`json/${selectedJsonFile}`)
      .then((response) => response.json())
      .then((data) => {
        tasksData = data;
        renderLists(tasksData);
      })
      .catch((error) => console.error(error));
  }
}

// Event listeners
const elements = getElements();
elements.addTaskBtn.addEventListener("click", addTask);
elements.clearAllBtn.addEventListener("click", clearAllTasks);
elements.homeLink.addEventListener('click', showHomeContent);
elements.aboutLink.addEventListener('click', showAboutContent);
elements.contactLink.addEventListener('click', showContactContent);
elements.taskSelect.addEventListener('change', (e) => {
  selectedJsonFile = e.target.value;
  fetchTasks();
});

// Initial fetch
elements.taskSelect.value = jsonFiles[0];
selectedJsonFile = jsonFiles[0];
fetchTasks();

// Show home content by default
elements.homeLink.click();

// Show home content
function showHomeContent() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>Features</h2>
    <ul>
      <li>Create, read, update, and delete tasks</li>
      <li>Drag-and-drop functionality to move tasks between lists</li>
      <li>Responsive design for mobile and desktop devices</li>
      <li>Support for multiple task lists</li>
      <li>Share tasks on social media</li>
    </ul>
  `;
}

// Show about content
function showAboutContent() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>About Us</h2>
    <p>This is a simple task manager application built using HTML, CSS, and JavaScript. It allows users to create, read, update, and delete tasks. The application also supports drag-and-drop functionality to move tasks between different lists.</p>
  `;
}

// Show contact content
function showContactContent() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>Contact Us</h2>
    <p>If you have any questions or concerns, please feel free to contact us:</p>
    <p>Email: <a href="mailto:demo@example.com">demo@example.com</a></p>
    <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
  `;
}