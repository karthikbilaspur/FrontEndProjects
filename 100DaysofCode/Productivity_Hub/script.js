document.addEventListener('DOMContentLoaded', () => {
    // Mock DOMPurify for this environment. In a real project, you'd include the library.
    // e.g., <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
    const DOMPurify = window.DOMPurify || {
        sanitize: (html) => html // In a real project, this would be the actual DOMPurify.sanitize function
    };

    // --- Global Utilities & State Management ---
    const STORAGE_PREFIX = 'productivityHub_';

    const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

    class AppStorage {
        static get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(STORAGE_PREFIX + key);
                return item? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error(`Error getting item from localStorage for key "${key}":`, e);
                return defaultValue;
            }
        }

        static set(key, value) {
            try {
                localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
            } catch (e) {
                console.error(`Error setting item to localStorage for key "${key}":`, e);
            }
        }
    }

    class AppViewSwitcher {
        constructor() {
            this.navItems = document.querySelectorAll('.nav-item');
            this.appViews = document.querySelectorAll('.app-view');
            this.activeViewCallback = null; // Callback for when a view becomes active
            this.initListeners();
        }

        initListeners() {
            this.navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetViewId = item.dataset.view;
                    this.activateView(targetViewId);
                });
            });
        }

        onViewActivated(callback) {
            this.activeViewCallback = callback;
        }

        activateView(viewId) {
            this.navItems.forEach(nav => nav.classList.remove('active'));
            this.appViews.forEach(view => view.classList.remove('active'));

            const targetNavItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
            if (targetNavItem) {
                targetNavItem.classList.add('active');
                targetNavItem.setAttribute('aria-current', 'page'); // For accessibility
            }
            this.navItems.forEach(nav => {
                if (nav!== targetNavItem) {
                    nav.removeAttribute('aria-current');
                }
            });

            const targetView = document.getElementById(viewId + '-view');
            if (targetView) {
                targetView.classList.add('active');
            }

            if (this.activeViewCallback) {
                this.activeViewCallback(viewId);
            }
        }
    }

    // --- Dark Mode / Theming ---
    class ThemeManager {
        constructor() {
            this.darkModeToggle = document.getElementById('dark-mode-toggle');
            this.initTheme();
            this.initListeners();
        }

        initTheme() {
            const savedTheme = AppStorage.get('theme', 'light');
            this.applyTheme(savedTheme);
        }

        initListeners() {
            this.darkModeToggle.addEventListener('click', () => {
                const currentTheme = document.body.classList.contains('dark-mode')? 'dark' : 'light';
                const newTheme = currentTheme === 'dark'? 'light' : 'dark';
                this.applyTheme(newTheme);
            });
        }

        applyTheme(theme) {
            document.body.classList.toggle('dark-mode', theme === 'dark');
            AppStorage.set('theme', theme);
            this.darkModeToggle.innerHTML = theme === 'dark'? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
            this.darkModeToggle.setAttribute('aria-label', theme === 'dark'? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
    }

    // --- Pomodoro Timer Logic ---
    class PomodoroTimer {
        constructor(viewSwitcher) {
            this.timerDisplay = document.getElementById('timer-display');
            this.startBtn = document.getElementById('start-timer');
            this.pauseBtn = document.getElementById('pause-timer');
            this.resetBtn = document.getElementById('reset-timer');
            this.modeBtns = document.querySelectorAll('.mode-btn');
            this.pomodoroTaskSpan = document.getElementById('pomodoro-task');

            this.customPomodoroTimeInput = document.getElementById('custom-pomodoro-time');
            this.customShortBreakTimeInput = document.getElementById('custom-short-break-time');
            this.customLongBreakTimeInput = document.getElementById('custom-long-break-time');
            this.saveCustomTimesBtn = document.getElementById('save-custom-times');
            this.audioFinish = document.getElementById('pomodoro-audio-finish');

            this.countdown = null;
            this.timeLeft = 0;
            this.initialTime = 0;
            this.isPaused = true;
            this.currentMode = 'pomodoro';
            this.pomodoroSettings = AppStorage.get('pomodoroSettings') || {
                'pomodoro': 25 * 60,
                'short-break': 5 * 60,
                'long-break': 15 * 60
            };
            this.viewSwitcher = viewSwitcher; // Reference to the view switcher

            this.loadCustomTimes();
            this.initListeners();
            this.resetTimer(); // Initialize display
        }

        loadCustomTimes() {
            this.customPomodoroTimeInput.value = this.pomodoroSettings.pomodoro / 60;
            this.customShortBreakTimeInput.value = this.pomodoroSettings['short-break'] / 60;
            this.customLongBreakTimeInput.value = this.pomodoroSettings['long-break'] / 60;
        }

        initListeners() {
            this.saveCustomTimesBtn.addEventListener('click', () => this.saveCustomTimes());
            this.startBtn.addEventListener('click', () => this.startTimer());
            this.pauseBtn.addEventListener('click', () => this.pauseTimer());
            this.resetBtn.addEventListener('click', () => this.resetTimer());
            this.modeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modeName = btn.dataset.modeName;
                    this.switchMode(modeName);
                });
            });
        }

        saveCustomTimes() {
            const p = parseInt(this.customPomodoroTimeInput.value);
            const sb = parseInt(this.customShortBreakTimeInput.value);
            const lb = parseInt(this.customLongBreakTimeInput.value);

            if (isNaN(p) || p < 1 || isNaN(sb) || sb < 1 || isNaN(lb) || lb < 1) {
                alert('Please enter valid positive numbers for all custom times.');
                return;
            }

            this.pomodoroSettings.pomodoro = p * 60;
            this.pomodoroSettings['short-break'] = sb * 60;
            this.pomodoroSettings['long-break'] = lb * 60;
            AppStorage.set('pomodoroSettings', this.pomodoroSettings);
            alert('Custom times saved!');
            this.resetTimer();
        }

        updateDisplay() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerDisplay.textContent = `${minutes < 10? '0' : ''}${minutes}:${seconds < 10? '0' : ''}${seconds}`;
            document.title = `${this.timerDisplay.textContent} | ${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)} | Productivity Hub`;
        }

        startTimer() {
            if (!this.isPaused) return;
            this.isPaused = false;
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Running';
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.initialTime = this.timeLeft;

            this.countdown = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft <= 0) {
                    clearInterval(this.countdown);
                    this.isPaused = true;
                    this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                    this.startBtn.disabled = false;
                    this.pauseBtn.disabled = true;
                    this.audioFinish.play();
                    alert(`${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)} finished!`);

                    if (this.currentMode === 'pomodoro') {
                        this.switchMode('short-break');
                    } else {
                        this.switchMode('pomodoro');
                    }
                }
            }, 1000);
        }

        pauseTimer() {
            if (this.isPaused) return;
            this.isPaused = true;
            clearInterval(this.countdown);
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }

        resetTimer() {
            this.pauseTimer();
            this.timeLeft = this.pomodoroSettings[this.currentMode];
            this.initialTime = this.timeLeft;
            this.updateDisplay();
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }

        switchMode(mode) {
            this.pauseTimer();
            this.currentMode = mode;

            this.modeBtns.forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.querySelector(`.mode-btn[data-mode-name="${mode}"]`);
            if (targetBtn) targetBtn.classList.add('active');

            this.resetTimer();
        }

        setPomodoroTask(taskText) {
            this.pomodoroTaskSpan.textContent = taskText;
            this.viewSwitcher.activateView('pomodoro');
        }
    }

    // --- To-Do List Logic (with Drag-and-Drop) ---
    class TodoList {
        constructor(viewSwitcher, pomodoroTimer) {
            this.newTodoInput = document.getElementById('new-todo-input');
            this.addTodoBtn = document.getElementById('add-todo-btn');
            this.todoListUl = document.getElementById('todo-list');
            this.todos = AppStorage.get('todos', []);
            this.viewSwitcher = viewSwitcher;
            this.pomodoroTimer = pomodoroTimer;

            this.draggedItem = null;
            this.dragOverElement = null; // Element currently being dragged over

            this.initListeners();
            this.renderTodos();
        }

        initListeners() {
            this.addTodoBtn.addEventListener('click', () => this.addTodo());
            this.newTodoInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.addTodo();
                }
            });
            this.todoListUl.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.todoListUl.addEventListener('dragleave', () => this.handleDragLeave());
            this.todoListUl.addEventListener('drop', (e) => this.handleDrop(e));
        }

        saveTodos() {
            AppStorage.set('todos', this.todos);
        }

        renderTodo(todo) {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-id', todo.id);
            listItem.setAttribute('draggable', 'true');
            listItem.setAttribute('role', 'listitem');
            listItem.setAttribute('tabindex', '0'); // Make draggable items focusable
            if (todo.completed) {
                listItem.classList.add('completed');
            }

            const sanitizedText = DOMPurify.sanitize(todo.text, { USE_PROFILES: { html: false } }); // Sanitize todo text
            listItem.innerHTML = `
                <span class="todo-text">${sanitizedText}</span>
                <div class="todo-actions">
                    <button class="complete-btn" title="${todo.completed? 'Mark as incomplete' : 'Mark as complete'}" aria-label="${todo.completed? 'Mark task as incomplete' : 'Mark task as complete'}">
                        <i class="${todo.completed? 'fas fa-check-square' : 'far fa-square'}"></i>
                    </button>
                    <button class="edit-todo-btn" title="Edit task" aria-label="Edit task ${sanitizedText}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="set-pomodoro-task-btn" title="Set as current Pomodoro task" aria-label="Set task ${sanitizedText} as current Pomodoro task">
                        <i class="fas fa-bullseye"></i>
                    </button>
                    <button class="delete-btn" title="Delete task" aria-label="Delete task ${sanitizedText}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            listItem.querySelector('.complete-btn').addEventListener('click', () => this.toggleTodoComplete(todo.id));
            listItem.querySelector('.edit-todo-btn').addEventListener('click', () => this.editTodo(todo.id));
            listItem.querySelector('.delete-btn').addEventListener('click', () => this.deleteTodo(todo.id));
            listItem.querySelector('.set-pomodoro-task-btn').addEventListener('click', () => this.pomodoroTimer.setPomodoroTask(todo.text));

            listItem.addEventListener('dragstart', (e) => this.handleDragStart(e, listItem));
            listItem.addEventListener('dragend', () => this.handleDragEnd(listItem));

            this.todoListUl.appendChild(listItem);
        }

        renderTodos() {
            this.todoListUl.innerHTML = '';
            this.todos.forEach(todo => this.renderTodo(todo));
        }

        handleDragStart(e, listItem) {
            this.draggedItem = listItem;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', listItem.dataset.id);
            setTimeout(() => {
                listItem.classList.add('dragging');
            }, 0);
        }

        handleDragEnd(listItem) {
            listItem.classList.remove('dragging');
            this.draggedItem = null;
            this.removeDragOverIndicators();
            this.updateTodoOrder();
        }

        handleDragOver(e) {
            e.preventDefault();
            if (this.draggedItem === null) return;

            const targetElement = e.target.closest('li');
            if (targetElement && targetElement!== this.draggedItem) {
                const afterElement = this.getDragAfterElement(e.clientY);
                this.removeDragOverIndicators();
                if (afterElement === null) {
                    this.dragOverElement = null; // Indicates appending to end
                } else {
                    this.dragOverElement = afterElement;
                    if (e.clientY - targetElement.getBoundingClientRect().top < targetElement.offsetHeight / 2) {
                        targetElement.classList.add('drag-over-indicator-top');
                    } else {
                        targetElement.classList.add('drag-over-indicator-bottom');
                    }
                }
            } else {
                this.removeDragOverIndicators();
                this.dragOverElement = null;
            }
        }

        handleDragLeave() {
            this.removeDragOverIndicators();
            this.dragOverElement = null;
        }

        handleDrop(e) {
            e.preventDefault();
            if (this.draggedItem === null ||!this.draggedItem.parentElement) return;

            const droppedId = e.dataTransfer.getData('text/plain');
            const droppedElement = this.todoListUl.querySelector(`[data-id="${droppedId}"]`);

            if (droppedElement && droppedElement.parentElement === this.todoListUl) { // Ensure it's a valid list item
                this.removeDragOverIndicators();

                if (this.dragOverElement === null) {
                    this.todoListUl.appendChild(droppedElement);
                } else {
                    this.todoListUl.insertBefore(droppedElement, this.dragOverElement);
                }
                this.updateTodoOrder();
            }
            this.draggedItem.classList.remove('dragging');
            this.draggedItem = null;
            this.dragOverElement = null;
        }

        removeDragOverIndicators() {
            this.todoListUl.querySelectorAll('.drag-over-indicator-top,.drag-over-indicator-bottom').forEach(el => {
                el.classList.remove('drag-over-indicator-top', 'drag-over-indicator-bottom');
            });
        }

        getDragAfterElement(y) {
            const draggableElements = [...this.todoListUl.querySelectorAll('li:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: -Number.MAX_VALUE }).element;
        }

        updateTodoOrder() {
            const newOrder = [];
            this.todoListUl.querySelectorAll('li').forEach(listItem => {
                const todoId = listItem.dataset.id;
                const todo = this.todos.find(t => t.id === todoId);
                if (todo) {
                    newOrder.push(todo);
                }
            });
            this.todos = newOrder;
            this.saveTodos();
        }

        addTodo() {
            const todoText = this.newTodoInput.value.trim();
            if (todoText) {
                const newTodo = {
                    id: generateUniqueId(),
                    text: todoText,
                    completed: false
                };
                this.todos.unshift(newTodo); // Add to beginning for better visibility
                this.saveTodos();
                this.renderTodos();
                this.newTodoInput.value = '';
            } else {
                alert('Todo task cannot be empty!');
            }
        }

        toggleTodoComplete(id) {
            this.todos = this.todos.map(todo =>
                todo.id === id? {...todo, completed:!todo.completed } : todo
            );
            this.saveTodos();
            this.renderTodos();
        }

        editTodo(id) {
            const todoItem = this.todos.find(todo => todo.id === id);
            if (todoItem) {
                const newText = prompt('Edit your task:', todoItem.text);
                if (newText!== null && newText.trim()!== '') {
                    todoItem.text = newText.trim();
                    this.saveTodos();
                    this.renderTodos();
                }
            }
        }

        deleteTodo(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                this.todos = this.todos.filter(todo => todo.id!== id);
                this.saveTodos();
                this.renderTodos();
            }
        }
    }

    // --- Notes App Logic (with Rich Text Editing & XSS Protection) ---
    class NotesApp {
        constructor(viewSwitcher) {
            this.newNoteTitleInput = document.getElementById('new-note-title');
            this.newNoteContentDiv = document.getElementById('new-note-content');
            this.addNoteBtn = document.getElementById('add-note-btn');
            this.notesListDiv = document.getElementById('notes-list');
            this.richTextToolbar = document.querySelector('.rich-text-toolbar');
            this.notes = AppStorage.get('notes', []);
            this.editingNoteId = null;
            this.viewSwitcher = viewSwitcher;

            this.initListeners();
            this.renderNotes();
        }

        initListeners() {
            this.richTextToolbar.addEventListener('click', (e) => this.handleRichTextCommand(e));
            this.addNoteBtn.addEventListener('click', () => this.handleAddUpdateNote());
        }

        handleRichTextCommand(e) {
            const button = e.target.closest('.rte-btn');
            if (button) {
                const command = button.dataset.command;
                if (command === 'createLink') {
                    const url = prompt('Enter the URL:', 'https://');
                    if (url && url.trim()!== '') { // Only execute if user provides a valid URL
                        document.execCommand(command, false, DOMPurify.sanitize(url, { USE_PROFILES: { html: false } })); // Sanitize URL
                    }
                } else {
                    document.execCommand(command, false, null);
                }
                this.newNoteContentDiv.focus();
            }
        }

        saveNotes() {
            AppStorage.set('notes', this.notes);
        }

        renderNote(note) {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.setAttribute('data-id', note.id);
            noteCard.setAttribute('role', 'article');

            const sanitizedTitle = DOMPurify.sanitize(note.title || 'Untitled Note', { USE_PROFILES: { html: false } });
            const sanitizedContent = DOMPurify.sanitize(note.content); // Full HTML sanitization for content

            noteCard.innerHTML = `
                <h3 contenteditable="true" data-id="${note.id}" class="note-title-editable" aria-label="Note title, click to edit">${sanitizedTitle}</h3>
                <div class="note-content-display">${sanitizedContent}</div>
                <div class="note-card-actions">
                    <button class="edit-note-btn" title="Edit note content" aria-label="Edit content of note ${sanitizedTitle}"><i class="fas fa-edit"></i></button>
                    <button class="delete-note-btn" title="Delete note" aria-label="Delete note ${sanitizedTitle}"><i class="fas fa-trash"></i></button>
                </div>
            `;

            const titleElement = noteCard.querySelector('.note-title-editable');
            titleElement.addEventListener('blur', (e) => this.updateNoteTitle(e.target.dataset.id, e.target.textContent));
            titleElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    titleElement.blur();
                }
            });

            noteCard.querySelector('.edit-note-btn').addEventListener('click', () => this.editNoteContent(note.id));
            noteCard.querySelector('.delete-note-btn').addEventListener('click', () => this.deleteNote(note.id));
            this.notesListDiv.appendChild(noteCard);
        }

        renderNotes() {
            this.notesListDiv.innerHTML = '';
            this.notes.forEach(note => this.renderNote(note));
        }

        handleAddUpdateNote() {
            const title = this.newNoteTitleInput.value.trim();
            let content = this.newNoteContentDiv.innerHTML.trim();

            // Check for actual content beyond just <br> tags
            if (!content || content === '<br>' || content.replace(/<[^>]*>/g, '').trim() === '') {
                alert('Note content cannot be empty!');
                return;
            }

            // Sanitize content before saving
            content = DOMPurify.sanitize(content);

            if (this.editingNoteId) {
                this.notes = this.notes.map(note =>
                    note.id === this.editingNoteId? {...note, title: title, content: content } : note
                );
                this.editingNoteId = null;
                alert('Note updated successfully!');
            } else {
                const newNote = {
                    id: generateUniqueId(),
                    title: title,
                    content: content,
                    timestamp: new Date().toISOString()
                };
                this.notes.unshift(newNote);
                alert('Note saved successfully!');
            }
            this.saveNotes();
            this.renderNotes();
            this.newNoteTitleInput.value = '';
            this.newNoteContentDiv.innerHTML = '';
            this.addNoteBtn.textContent = 'Save Note';
        }

        updateNoteTitle(id, newTitle) {
            const noteToUpdate = this.notes.find(note => note.id === id);
            if (noteToUpdate) {
                noteToUpdate.title = DOMPurify.sanitize(newTitle.trim(), { USE_PROFILES: { html: false } });
                this.saveNotes();
                this.renderNotes();
            }
        }

        editNoteContent(id) {
            const noteToEdit = this.notes.find(note => note.id === id);
            if (noteToEdit) {
                this.newNoteTitleInput.value = noteToEdit.title;
                this.newNoteContentDiv.innerHTML = noteToEdit.content; // Render sanitized content back to editor
                this.addNoteBtn.textContent = 'Update Note';
                this.editingNoteId = noteToEdit.id;
                this.viewSwitcher.activateView('notes');
                this.newNoteContentDiv.focus();
                // Move cursor to end of contenteditable for better UX
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(this.newNoteContentDiv);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        deleteNote(id) {
            if (confirm('Are you sure you want to delete this note?')) {
                this.notes = this.notes.filter(note => note.id!== id);
                this.saveNotes();
                this.renderNotes();
                if (this.editingNoteId === id) {
                    this.newNoteTitleInput.value = '';
                    this.newNoteContentDiv.innerHTML = '';
                    this.addNoteBtn.textContent = 'Save Note';
                    this.editingNoteId = null;
                }
            }
        }
    }

    // --- Calendar Logic (UPGRADED) ---
    class CalendarApp {
        constructor() {
            this.calendarGrid = document.getElementById('calendar-grid');
            this.currentMonthYearHeader = document.getElementById('current-month-year');
            this.prevMonthBtn = document.getElementById('prev-month-btn');
            this.nextMonthBtn = document.getElementById('next-month-btn');
            this.todayBtn = document.getElementById('today-btn'); // New 'Today' button

            this.eventModal = document.getElementById('event-modal');
            this.closeModalBtn = this.eventModal.querySelector('.close-button');

            this.modalDateSpan = document.getElementById('modal-date');

            this.eventListContainer = document.getElementById('event-list-container');
            this.eventFormContainer = document.getElementById('event-form-container');

            this.eventTitleInput = document.getElementById('event-title-input');
            this.eventTimeInput = document.getElementById('event-time-input');
            this.eventDescriptionInput = document.getElementById('event-description-input');
            this.eventColorInput = document.getElementById('event-color-input'); // New color input

            this.eventRecurrenceSelect = document.getElementById('event-recurrence');
            this.recurrenceEndDateWrapper = document.getElementById('recurrence-end-date-wrapper');
            this.recurrenceEndDateInput = document.getElementById('recurrence-end-date');

            this.saveEventBtn = document.getElementById('save-event-btn');
            this.deleteEventBtn = document.getElementById('delete-event-btn');
            this.addNewEventBtn = document.getElementById('add-new-event-btn');
            this.backToListBtn = document.getElementById('back-to-list-btn');

            this.currentCalendarDate = new Date();
            this.selectedDateForEvent = null; // Stored as 'YYYY-MM-DD'
            this.editingEventId = null;

            this.events = AppStorage.get('calendarEvents', []);

            this.initListeners();
        }

        initListeners() {
            this.prevMonthBtn.onclick = () => this.navigateMonth(-1);
            this.nextMonthBtn.onclick = () => this.navigateMonth(1);
            this.todayBtn.onclick = () => this.goToToday();
            this.addNewEventBtn.onclick = () => this.showEventForm();
            this.backToListBtn.onclick = () => this.showEventList();
            this.saveEventBtn.onclick = () => this.saveEvent();
            this.deleteEventBtn.onclick = () => this.deleteEvent();
            this.closeModalBtn.onclick = () => this.closeEventModal();
            window.onclick = (e) => {
                if (e.target === this.eventModal) this.closeEventModal();
            };
            this.eventRecurrenceSelect.addEventListener('change', () => this.toggleRecurrenceEndDateVisibility());
        }

        formatDate(date) {
            return date.toISOString().split('T')[0];
        }

        parseDate(dateString) {
            // Parses 'YYYY-MM-DD' string to a Date object, handling timezone issues
            const [year, month, day] = dateString.split('-').map(Number);
            return new Date(year, month - 1, day); // Month is 0-indexed
        }

        addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        addWeeks(date, weeks) {
            const result = new Date(date);
            result.setDate(result.getDate() + (weeks * 7));
            return result;
        }

        addMonths(date, months) {
            const result = new Date(date);
            result.setMonth(result.getMonth() + months);
            return result;
        }

        navigateMonth(delta) {
            this.currentCalendarDate = this.addMonths(this.currentCalendarDate, delta);
            this.renderCalendar();
        }

        goToToday() {
            this.currentCalendarDate = new Date();
            this.renderCalendar();
        }

        renderCalendar() {
            this.calendarGrid.innerHTML = `
                <div class="day-header">Sun</div>
                <div class="day-header">Mon</div>
                <div class="day-header">Tue</div>
                <div class="day-header">Wed</div>
                <div class="day-header">Thu</div>
                <div class="day-header">Fri</div>
                <div class="day-header">Sat</div>
            `;

            const year = this.currentCalendarDate.getFullYear();
            const month = this.currentCalendarDate.getMonth();

            this.currentMonthYearHeader.textContent =
                this.currentCalendarDate.toLocaleString("default", { month: "long", year: "numeric" });

            const firstDayOfMonth = new Date(year, month, 1);
            const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const todayFormatted = this.formatDate(new Date());

            // Fill leading empty days
            for (let i = 0; i < startingDayOfWeek; i++) {
                const empty = document.createElement("div");
                empty.classList.add("day", "inactive");
                this.calendarGrid.appendChild(empty);
            }

            // Fill days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const fullDateFormatted = this.formatDate(date);

                const dayDiv = document.createElement("div");
                dayDiv.classList.add("day");
                dayDiv.dataset.date = fullDateFormatted;
                dayDiv.setAttribute('aria-label', `Day ${day}, ${date.toLocaleDateString()}`);

                if (fullDateFormatted === todayFormatted) {
                    dayDiv.classList.add("today");
                    dayDiv.setAttribute('aria-current', 'date');
                }

                // Filter events including recurring ones
                const dayEvents = this.getEventsForDate(fullDateFormatted)
                   .sort((a, b) => a.time.localeCompare(b.time));

                dayDiv.innerHTML = `<span class="day-number">${day}</span>`;

                const eventsDiv = document.createElement("div");
                eventsDiv.classList.add("day-events");

                dayEvents.forEach(ev => {
                    const evSpan = document.createElement("span");
                    evSpan.classList.add("event-preview");
                    evSpan.style.backgroundColor = ev.color || "#3498db";
                    evSpan.textContent = `${ev.time} ${ev.title}`;
                    eventsDiv.appendChild(evSpan);
                });

                dayDiv.appendChild(eventsDiv);

                dayDiv.addEventListener("click", () => {
                    this.openEventModal(fullDateFormatted);
                });

                this.calendarGrid.appendChild(dayDiv);
            }
        }

        getEventsForDate(dateString) {
            const date = this.parseDate(dateString);
            const dayEvents = [];

            this.events.forEach(event => {
                const eventStartDate = this.parseDate(event.date);

                if (event.recurrence === 'none') {
                    if (event.date === dateString) {
                        dayEvents.push(event);
                    }
                } else {
                    const recurrenceEndDate = event.recurrenceEndDate? this.parseDate(event.recurrenceEndDate) : null;

                    if (eventStartDate <= date && (!recurrenceEndDate || date <= recurrenceEndDate)) {
                        switch (event.recurrence) {
                            case 'daily':
                                dayEvents.push(event);
                                break;
                            case 'weekly':
                                if (eventStartDate.getDay() === date.getDay() &&
                                    (date.getTime() - eventStartDate.getTime()) % (7 * 24 * 60 * 60 * 1000) === 0) {
                                    dayEvents.push(event);
                                }
                                break;
                            case 'monthly':
                                if (eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() <= date.getMonth() && eventStartDate.getFullYear() <= date.getFullYear()) {
                                    dayEvents.push(event);
                                }
                                break;
                        }
                    }
                }
            });
            return dayEvents;
        }

        openEventModal(date) {
            this.selectedDateForEvent = date;
            this.modalDateSpan.textContent = new Date(date).toDateString();
            this.eventModal.style.display = "flex";
            this.showEventList();
        }

        closeEventModal() {
            this.eventModal.style.display = "none";
            this.editingEventId = null; // Reset editing state
        }

        showEventList() {
            this.eventFormContainer.style.display = "none";
            this.addNewEventBtn.style.display = "block";
            this.backToListBtn.style.display = "none";
            this.eventListContainer.style.display = "block";
            this.editingEventId = null; // Ensure editing state is reset

            this.renderEventList(this.selectedDateForEvent);
        }

        renderEventList(date) {
            this.eventListContainer.innerHTML = "";

            const dayEvents = this.getEventsForDate(date)
               .sort((a, b) => a.time.localeCompare(b.time));

            if (dayEvents.length === 0) {
                this.eventListContainer.innerHTML = "<p>No events for this day.</p>";
                return;
            }

            dayEvents.forEach(ev => {
                const item = document.createElement("div");
                item.classList.add("modal-event-item");
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', `View details for event: ${ev.title} at ${ev.time}`);

                item.innerHTML = `
                    <span style="color:${ev.color || '#333'}"><strong>${ev.time}</strong> ${DOMPurify.sanitize(ev.title, { USE_PROFILES: { html: false } })}</span>
                `;

                item.onclick = () => {
                    this.editEvent(ev.originalId || ev.id); // Use originalId for recurring events
                };
                item.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.editEvent(ev.originalId || ev.id);
                    }
                };

                this.eventListContainer.appendChild(item);
            });
        }

        showEventForm() {
            this.eventListContainer.style.display = "none";
            this.addNewEventBtn.style.display = "none";
            this.backToListBtn.style.display = "block";
            this.eventFormContainer.style.display = "block";

            // Reset form for new event
            this.eventTitleInput.value = "";
            this.eventTimeInput.value = "09:00";
            this.eventDescriptionInput.value = "";
            this.eventColorInput.value = "#4CAF50";
            this.eventRecurrenceSelect.value = "none";
            this.recurrenceEndDateInput.value = "";
            this.recurrenceEndDateWrapper.style.display = "none";

            this.editingEventId = null;
            this.saveEventBtn.textContent = "Save Event";
            this.deleteEventBtn.style.display = "none";
        }

        editEvent(id) {
            const ev = this.events.find(e => e.id === id);

            if (!ev) {
                alert('Event not found for editing.');
                this.showEventList();
                return;
            }

            this.showEventForm(); // Show the form
            this.editingEventId = id;

            this.eventTitleInput.value = ev.title;
            this.eventTimeInput.value = ev.time;
            this.eventDescriptionInput.value = ev.description;
            this.eventColorInput.value = ev.color || "#4CAF50";
            this.eventRecurrenceSelect.value = ev.recurrence || "none";
            this.recurrenceEndDateInput.value = ev.recurrenceEndDate || "";
            this.toggleRecurrenceEndDateVisibility();

            this.saveEventBtn.textContent = "Update Event";
            this.deleteEventBtn.style.display = "block";
        }

        toggleRecurrenceEndDateVisibility() {
            if (this.eventRecurrenceSelect.value!== 'none') {
                this.recurrenceEndDateWrapper.style.display = 'block';
                this.recurrenceEndDateInput.setAttribute('required', 'true');
            } else {
                this.recurrenceEndDateWrapper.style.display = 'none';
                this.recurrenceEndDateInput.removeAttribute('required');
            }
        }

        saveEvent() {
            const title = this.eventTitleInput.value.trim();
            const time = this.eventTimeInput.value;
            const description = this.eventDescriptionInput.value.trim();
            const color = this.eventColorInput.value;
            const recurrence = this.eventRecurrenceSelect.value;
            const recurrenceEndDate = this.recurrenceEndDateInput.value;

            if (!title) {
                alert("Event title is required!");
                return;
            }
            if (recurrence!== 'none' &&!recurrenceEndDate) {
                alert("Please select an end date for recurring events.");
                return;
            }
            if (recurrence!== 'none' && this.parseDate(recurrenceEndDate) < this.parseDate(this.selectedDateForEvent)) {
                alert("Recurrence end date cannot be before the event start date.");
                return;
            }

            const eventData = {
                id: this.editingEventId || generateUniqueId(),
                title: DOMPurify.sanitize(title, { USE_PROFILES: { html: false } }),
                time: time,
                date: this.selectedDateForEvent, // This is the START date for recurring events
                description: DOMPurify.sanitize(description),
                color: color,
                recurrence: recurrence,
                recurrenceEndDate: recurrenceEndDate || null
            };

            if (this.editingEventId) {
                // If it's an existing event, update it
                this.events = this.events.map(e =>
                    e.id === this.editingEventId? eventData : e
                );
            } else {
                // If it's a new event, add it
                this.events.push(eventData);
            }

            AppStorage.set('calendarEvents', this.events);
            this.renderCalendar();
            this.showEventList(); // Go back to event list
        }

        deleteEvent() {
            if (!this.editingEventId) return;

            const eventToDelete = this.events.find(e => e.id === this.editingEventId);

            if (eventToDelete && eventToDelete.recurrence!== 'none') {
                const confirmation = confirm("This is a recurring event. Do you want to delete:\n- Only this event occurrence (not yet implemented for series deletion, currently deletes series)?\n- Or the entire series of events?");
                if (!confirmation) return;
                // For simplicity, for now deleting a recurring event deletes the entire series
                this.events = this.events.filter(e => e.id!== this.editingEventId);
            } else {
                if (!confirm("Are you sure you want to delete this event?")) {
                    return;
                }
                this.events = this.events.filter(e => e.id!== this.editingEventId);
            }

            AppStorage.set('calendarEvents', this.events);
            this.renderCalendar();
            this.showEventList();
        }
    }

    // --- Data Export/Import ---
    class DataManager {
        constructor(viewSwitcher, pomodoroTimer, todoList, notesApp, calendarApp) {
            this.exportDataBtn = document.getElementById('export-data-btn');
            this.importDataBtn = document.getElementById('import-data-btn');
            this.importDataInput = document.getElementById('import-data-input');

            this.viewSwitcher = viewSwitcher;
            this.pomodoroTimer = pomodoroTimer;
            this.todoList = todoList;
            this.notesApp = notesApp;
            this.calendarApp = calendarApp;

            this.initListeners();
        }

        initListeners() {
            this.exportDataBtn.addEventListener('click', () => this.exportData());
            this.importDataBtn.addEventListener('click', () => this.importDataInput.click());
            this.importDataInput.addEventListener('change', (event) => this.handleImportFile(event));
        }

        exportData() {
            const data = {
                todos: this.todoList.todos,
                notes: this.notesApp.notes,
                events: this.calendarApp.events,
                pomodoroSettings: this.pomodoroTimer.pomodoroSettings,
                theme: AppStorage.get('theme')
            };
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `productivity_hub_data_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        }

        handleImportFile(event) {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (confirm('Importing data will overwrite your current data. Are you sure?')) {
                        if (importedData.todos) {
                            this.todoList.todos = importedData.todos;
                            this.todoList.saveTodos();
                            this.todoList.renderTodos();
                        }
                        if (importedData.notes) {
                            this.notesApp.notes = importedData.notes;
                            this.notesApp.saveNotes();
                            this.notesApp.renderNotes();
                        }
                        if (importedData.events) {
                            this.calendarApp.events = importedData.events;
                            this.calendarApp.saveEvents();
                            this.calendarApp.renderCalendar();
                        }
                        if (importedData.pomodoroSettings) {
                            this.pomodoroTimer.pomodoroSettings = importedData.pomodoroSettings;
                            AppStorage.set('pomodoroSettings', this.pomodoroTimer.pomodoroSettings);
                            this.pomodoroTimer.loadCustomTimes(); // Update UI
                            this.pomodoroTimer.resetTimer();
                        }
                        if (importedData.theme) {
                            themeManager.applyTheme(importedData.theme);
                        }
                        alert('Data imported successfully!');
                    }
                } catch (error) {
                    alert('Failed to import data: Invalid JSON file or corrupted data.');
                    console.error('Import error:', error);
                }
                this.importDataInput.value = ''; // Clear the input so same file can be re-selected
            };
            reader.readAsText(file);
        }
    }

    // --- Initialize Application Components ---
    const themeManager = new ThemeManager();
    const viewSwitcher = new AppViewSwitcher();
    const pomodoroTimer = new PomodoroTimer(viewSwitcher);
    const todoList = new TodoList(viewSwitcher, pomodoroTimer);
    const notesApp = new NotesApp(viewSwitcher);
    const calendarApp = new CalendarApp();
    const dataManager = new DataManager(viewSwitcher, pomodoroTimer, todoList, notesApp, calendarApp);

    // --- Initial View Activation ---
    // Handle view activation from the view switcher
    viewSwitcher.onViewActivated((viewId) => {
        if (viewId === 'calendar') {
            calendarApp.renderCalendar();
        }
        // If other views need specific initialization when activated, add them here
    });

    // Activate default view (will also trigger calendar render if it's the default)
    viewSwitcher.activateView('pomodoro');
});