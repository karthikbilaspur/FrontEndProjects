// Get elements
const elements = {
  newNoteBtn: document.getElementById('new-note'),
  saveNoteBtn: document.getElementById('save-note'),
  addNoteBtn: document.getElementById('add-note'),
  deleteNoteBtn: document.getElementById('delete-note'),
  editNoteBtn: document.getElementById('edit-note'),
  renameNoteBtn: document.getElementById('rename-note'),
  noteTitleInput: document.getElementById('note-title'),
  editor: document.getElementById('editor'),
  folderSelect: document.getElementById('folder-select'),
  notesContainer: document.getElementById('notes-container'),
  searchNoteInput: document.getElementById('search-note'),
  addTagBtn: document.getElementById('add-tag'),
  tagInput: document.getElementById('tag-input'),
  tagDropdown: document.getElementById('tag-dropdown'),
  addFolderBtn: document.getElementById('add-folder'),
  deleteFolderBtn: document.getElementById('delete-folder'),
  sortTitleBtn: document.getElementById('sort-title'),
  sortCreatedBtn: document.getElementById('sort-created'),
  sortModifiedBtn: document.getElementById('sort-modified'),
  shareNoteBtn: document.getElementById('share-note'),
  remindMeBtn: document.getElementById('remind-me'),
  reminderDateInput: document.getElementById('reminder-date'),
  reminderTimeInput: document.getElementById('reminder-time'),
  themeSelect: document.getElementById('theme-select'),
  calendarBtn: document.getElementById('calendar-btn'),
  importBtn: document.getElementById('import-btn'),
  exportBtn: document.getElementById('export-btn'),
  duplicateNoteBtn: document.getElementById('duplicate-note'),
  archiveNoteBtn: document.getElementById('archive-note'),
  restoreNoteBtn: document.getElementById('restore-note'),
};

// Initialize notes and folders
let notes = [];
let folders = ['Default'];
let currentNote = null;
let currentFolder = 'Default';
let autosaveInterval;
let sortBy = 'title';
let tags = [];

// Load notes and folders from local storage
try {
  notes = JSON.parse(localStorage.getItem('notes')) || [];
  folders = JSON.parse(localStorage.getItem('folders')) || ['Default'];
  tags = JSON.parse(localStorage.getItem('tags')) || [];
} catch (error) {
  console.error('Error loading data from local storage:', error);
}

// Render folders
folders.forEach((folder) => {
  const option = document.createElement('option');
  option.value = folder;
  option.textContent = folder;
  elements.folderSelect.appendChild(option);
});

// Render notes
function renderNotes(notesToRender = notes) {
  elements.notesContainer.innerHTML = '';
  notesToRender.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <h5>${note.title}</h5>
      <p>${note.content}</p>
      <small>Folder: ${note.folder}</small>
    `;
    elements.notesContainer.appendChild(noteElement);
  });
}

// Event listeners
elements.saveNoteBtn.addEventListener('click', saveNote);
elements.editNoteBtn.addEventListener('click', () => {
  if (currentNote) {
    elements.noteTitleInput.value = currentNote.title;
    elements.editor.innerHTML = currentNote.content;
  }
});

elements.deleteNoteBtn.addEventListener('click', () => {
  if (currentNote) {
    if (confirm('Are you sure you want to delete this note?')) {
      const index = notes.findIndex((note) => note.id === currentNote.id);
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
      currentNote = null;
    }
  }
});

elements.folderSelect.addEventListener('change', () => {
  currentFolder = elements.folderSelect.value;
});

elements.newNoteBtn.addEventListener('click', () => {
  currentNote = null;
  elements.noteTitleInput.value = '';
  elements.editor.innerHTML = '';
});

elements.addFolderBtn.addEventListener('click', () => {
  const folderName = prompt('Enter folder name');
  if (folderName) {
    folders.push(folderName);
    localStorage.setItem('folders', JSON.stringify(folders));
    const option = document.createElement('option');
    option.value = folderName;
    option.textContent = folderName;
    elements.folderSelect.appendChild(option);
  }
});

elements.deleteFolderBtn.addEventListener('click', () => {
  if (currentFolder !== 'Default') {
    const index = folders.findIndex((folder) => folder === currentFolder);
    folders.splice(index, 1);
    localStorage.setItem('folders', JSON.stringify(folders));
    elements.folderSelect.removeChild(elements.folderSelect.options[elements.folderSelect.selectedIndex]);
  }
});

elements.searchNoteInput.addEventListener('input', () => {
  const searchTerm = elements.searchNoteInput.value.toLowerCase();
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchTerm));
  renderNotes(filteredNotes);
});

elements.addTagBtn.addEventListener('click', () => {
  const tagName = elements.tagInput.value;
  if (tagName) {
    tags.push(tagName);
    localStorage.setItem('tags', JSON.stringify(tags));
    const tagElement = document.createElement('li');
    tagElement.innerHTML = `
      <a class="dropdown-item" href="#">${tagName}</a>
    `;
    elements.tagDropdown.appendChild(tagElement);
    elements.tagInput.value = '';
  }
});

elements.sortTitleBtn.addEventListener('click', () => {
  sortBy = 'title';
  notes.sort((a, b) => a.title.localeCompare(b.title));
  renderNotes();
});

elements.sortCreatedBtn.addEventListener('click', () => {
  sortBy = 'created';
  notes.sort((a, b) => a.id - b.id);
  renderNotes();
});

elements.sortModifiedBtn.addEventListener('click', () => {
  sortBy = 'modified';
  notes.sort((a, b) => {
    const aDate = new Date(a.modified || a.id);
    const bDate = new Date(b.modified || b.id);
    return bDate - aDate;
  });
  renderNotes();
});

// Autosave
elements.noteTitleInput.addEventListener('input', () => {
  clearTimeout(autosaveInterval);
  autosaveInterval = setTimeout(() => {
    saveNote(null, () => {
      console.log('Autosaved');
    });
  }, 5000);
});
elements.editor.addEventListener('input', () => {
  clearTimeout(autosaveInterval);
  autosaveInterval = setTimeout(() => {
    saveNote(null, () => {
      console.log('Autosaved');
    });
  }, 5000);
});

// Update note modified date
function updateNoteModifiedDate(note) {
  note.modified = Date.now();
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Save note
function saveNote(event, callback) {
  const title = elements.noteTitleInput.value;
  const content = elements.editor.innerHTML;
  if (title && content) {
    if (currentNote) {
      // Update existing note
      const index = notes.findIndex((note) => note.id === currentNote.id);
      notes[index] = { ...currentNote, title, content };
      updateNoteModifiedDate(notes[index]);
    } else {
      // Create new note
      const note = { id: Date.now(), title, content, folder: currentFolder };
      notes.push(note);
      currentNote = note;
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    if (callback) callback();
  } else {
    alert('Please enter a title and content for your note.');
  }
}

// Implement keyboard shortcuts
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    saveNote();
  }
  if (event.ctrlKey && event.key === 'n') {
    event.preventDefault();
    elements.newNoteBtn.click();
  }
});

// Initial render
renderNotes();

// Add note sharing functionality
elements.shareNoteBtn.addEventListener('click', () => {
  const noteId = currentNote.id;
  const shareLink = `https://example.com/notes/${noteId}`;
  navigator.clipboard.writeText(shareLink);
  alert('Note link copied to clipboard!');
});

// Add reminders
elements.remindMeBtn.addEventListener('click', () => {
  const reminderDate = elements.reminderDateInput.value;
  const reminderTime = elements.reminderTimeInput.value;
  const reminder = {
    date: reminderDate,
    time: reminderTime,
  };
  currentNote.reminder = reminder;
  localStorage.setItem('notes', JSON.stringify(notes));
});

// Add theme switching
elements.themeSelect.addEventListener('change', () => {
  const theme = elements.themeSelect.value;
  document.body.className = theme;
});

// Add calendar integration
elements.calendarBtn.addEventListener('click', () => {
  const calendarEvent = {
    summary: currentNote.title,
    description: currentNote.content,
    start: {
      dateTime: currentNote.reminder.date + 'T' + currentNote.reminder.time,
    },
    end: {
      dateTime: currentNote.reminder.date + 'T' + currentNote.reminder.time,
    },
  };
  gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: calendarEvent,
  })
  .then((response) => {
    console.log('Calendar event created:', response);
  })
  .catch((error) => {
    console.error('Error creating calendar event:', error);
  });
});

// Initialize Select2
$(document).ready(function() {
  $('#tag-dropdown').select2({
    tags: true,
    tokenSeparators: [',', ' '],
    data: tags
  });
});

// Update tags data
function updateTags() {
  $('#tag-dropdown').empty();
  $('#tag-dropdown').select2({
    tags: true,
    tokenSeparators: [',', ' '],
    data: tags
  });
}

// Add event listener to add tag button
elements.addTagBtn.addEventListener('click', () => {
  const tagName = elements.tagInput.value;
  if (tagName) {
    tags.push(tagName);
    localStorage.setItem('tags', JSON.stringify(tags));
    updateTags();
    elements.tagInput.value = '';
  }
});

// Initialize Choices.js
const tagDropdown = new Choices('#tag-dropdown', {
  removeItemButton: true,
  duplicateItemsAllowed: false,
});

// Update tags data
function updateTags() {
  tagDropdown.setChoices(tags, 'value', 'label');
}

// Add event listener to add tag button
elements.addTagBtn.addEventListener('click', () => {
  const tagName = elements.tagInput.value;
  if (tagName) {
    tags.push({ value: tagName, label: tagName });
    localStorage.setItem('tags', JSON.stringify(tags));
    updateTags();
    elements.tagInput.value = '';
  }
});