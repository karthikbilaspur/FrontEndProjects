// script.js
class Pomodoro {
  constructor(workTime = 25, breakTime = 5) {
    this.workTime = workTime * 60;
    this.breakTime = breakTime * 60;
    this.currentTime = this.workTime;
    this.isWorking = true;
    this.completedPomodoros = 0;
    this.totalTimeSpent = 0;
    this.tasks = [];
    this.history = [];
    this.theme = localStorage.getItem('theme') || 'light';
    this.timerInterval = null;
    this.elements = {
      timerDisplay: document.querySelector('.timer-display'),
      startBtn: document.getElementById('btn-start'),
      resetBtn: document.getElementById('btn-reset'),
      taskList: document.getElementById('task-list'),
      taskInput: document.getElementById('task-input'),
      addTaskBtn: document.getElementById('add-task-btn'),
      settingsBtn: document.getElementById('btn-settings'),
      settingsModal: document.getElementById('settings-modal'),
      workTimeInput: document.getElementById('work-time-input'),
      breakTimeInput: document.getElementById('break-time-input'),
      saveSettingsBtn: document.getElementById('save-settings-btn'),
      timerStatus: document.querySelector('.timer-status'),
    };

    this.initEventListeners();
    this.loadTasks();
    this.loadTheme();
    this.updateStats();
  }

  initEventListeners() {
    this.elements.startBtn.addEventListener('click', () => this.toggleTimer());
    this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
    this.elements.addTaskBtn.addEventListener('click', () => this.addTask());
    this.elements.settingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
  }

  toggleTimer() {
    if (this.timerInterval) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (confirm('Start timer?')) {
      this.timerInterval = setInterval(() => this.tick(), 1000);
      this.elements.startBtn.textContent = 'Pause';
      this.notify('Timer started!');
    }
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.elements.startBtn.textContent = 'Start';
    this.notify('Timer paused!');
  }

  tick() {
    this.currentTime--;
    this.updateTimerDisplay();
    if (this.currentTime === 0) {
      this.switchTimer();
    }
  }

  switchTimer() {
    this.isWorking = !this.isWorking;
    if (this.isWorking) {
      this.completedPomodoros++;
      this.totalTimeSpent += this.workTime;
      this.updateStats();
      this.history.push(`Pomodoro ${this.completedPomodoros} completed`);
      this.updateHistoryList();
    } else {
      alert('Break time! Do some stretching or meditation exercises.');
      this.notify('Break time!');
    }
    this.currentTime = this.isWorking ? this.workTime : this.breakTime;
    this.elements.timerStatus.textContent = this.isWorking ? 'Work Time' : 'Break Time';
  }

  resetTimer() {
    if (confirm('Are you sure you want to reset the timer?')) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.currentTime = this.workTime;
      this.isWorking = true;
      this.elements.timerStatus.textContent = 'Work Time';
      this.updateTimerDisplay();
      this.elements.startBtn.textContent = 'Start';
      this.notify('Timer reset!');
    }
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    this.elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateStats() {
    document.getElementById('tasks-completed').textContent = `Tasks completed: ${this.completedPomodoros}`;
    document.getElementById('time-spent').textContent = `Time spent: ${Math.floor(this.totalTimeSpent / 60)} hours`;
  }

  addTask() {
    const taskText = this.elements.taskInput.value.trim();
    if (taskText !== '') {
      const taskItem = this.createTaskItem(taskText);
      this.elements.taskList.appendChild(taskItem);
      this.tasks.push({ text: taskText });
      this.elements.taskInput.value = '';
      this.saveTasks();
    }
  }

  createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this.deleteTask(taskItem));
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => this.editTask(taskItem));
    taskItem.appendChild(deleteBtn);
    taskItem.appendChild(editBtn);
    return taskItem;
  }

  deleteTask(taskItem) {
    const taskIndex = Array.prototype.indexOf.call(this.elements.taskList.children, taskItem);
    this.tasks.splice(taskIndex, 1);
    taskItem.remove();
    this.saveTasks();
  }

  editTask(taskItem) {
    const taskIndex = Array.prototype.indexOf.call(this.elements.taskList.children, taskItem);
    const newText = prompt('Enter new task text:');
    if (newText !== null) {
      this.tasks[taskIndex].text = newText;
      taskItem.textContent = newText;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteTask(taskItem));
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => this.editTask(taskItem));
      taskItem.appendChild(deleteBtn);
      taskItem.appendChild(editBtn);
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.tasks.forEach((task) => {
        const taskItem = this.createTaskItem(task.text);
        this.elements.taskList.appendChild(taskItem);
      });
    }
  }

  openSettingsModal() {
    this.elements.settingsModal.style.display = 'block';
  }

  saveSettings() {
    const workTime = parseInt(this.elements.workTimeInput.value);
    const breakTime = parseInt(this.elements.breakTimeInput.value);
    if (!isNaN(workTime) && !isNaN(breakTime) && workTime > 0 && breakTime > 0) {
      this.workTime = workTime * 60;
      this.breakTime = breakTime * 60;
      this.currentTime = this.isWorking ? this.workTime : this.breakTime;
      this.updateTimerDisplay();
      this.elements.settingsModal.style.display = 'none';
      this.notify('Settings saved!');
    } else {
      alert('Please enter valid work and break times.');
    }
  }

  loadTheme() {
    document.body.className = this.theme;
  }

  notify(message) {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    }
  }

  updateHistoryList() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    this.history.forEach((item) => {
      const historyItem = document.createElement('li');
      historyItem.textContent = item;
      historyList.appendChild(historyItem);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pomodoro = new Pomodoro();
});