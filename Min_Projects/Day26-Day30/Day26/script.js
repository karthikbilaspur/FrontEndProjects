// Selectors
const main = document.querySelector("#main");
const popup = new bootstrap.Modal(document.querySelector("#popup"));
const reminderPopup = new bootstrap.Modal(document.querySelector("#reminderPopup"));
const archivePopup = new bootstrap.Modal(document.querySelector("#archivePopup"));
const shareModal = new bootstrap.Modal(document.querySelector("#shareModal"));
const yesBtn = document.querySelector("#yesBtn");
const noBtn = document.querySelector("#noBtn");
const darkModeBtn = document.querySelector("#darkModeBtn");
const searchInput = document.querySelector("#searchInput");
const reminderBtn = document.querySelector("#reminderBtn");
const setReminderBtn = document.querySelector("#setReminderBtn");
const reminderInput = document.querySelector("#reminderInput");
const archiveBtn = document.querySelector("#archiveBtn");
const archivedNotesDiv = document.querySelector("#archivedNotes");
const addBtn = document.querySelector("#addBtn");
const shareBtn = document.querySelector("#shareBtn");
const facebookBtn = document.querySelector("#facebookBtn");
const twitterBtn = document.querySelector("#twitterBtn");
const whatsappBtn = document.querySelector("#whatsappBtn");
const emailBtn = document.querySelector("#emailBtn");

// State
let notes = [];
let archivedNotes = [];
let noteToDelete = null;
let reminderNote = null;
let darkMode = false;
let sharedNote = null;

// Functions
function createNoteElement(title = '', content = '') {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note', 'col-md-4', 'mb-3');
  noteElement.innerHTML = `
    <div class="icons">
      <i class="save fas fa-save" style="color:red"></i>
      <i class="trash fas fa-trash" style="color:yellow"></i>
      <i class="reminder fas fa-bell" style="color:blue"></i>
      <i class="archive fas fa-archive" style="color:green"></i>
      <i class="share fas fa-share" style="color:purple"></i>
    </div>
    <textarea class="title form-control mb-2" placeholder="Write the title ...">${title}</textarea>
    <textarea class="content form-control" placeholder="Note down your thoughts ...">${content}</textarea>
  `;
  const trashIcon = noteElement.querySelector('.trash');
  trashIcon.addEventListener('click', () => {
    noteToDelete = noteElement;
    popup.show();
  });
  const reminderIcon = noteElement.querySelector('.reminder');
  reminderIcon.addEventListener('click', () => {
    reminderNote = noteElement;
    reminderPopup.show();
  });
  const archiveIcon = noteElement.querySelector('.archive');
  archiveIcon.addEventListener('click', () => {
    archiveNote(noteElement);
  });
  const shareIcon = noteElement.querySelector('.share');
  shareIcon.addEventListener('click', () => {
    sharedNote = noteElement;
    shareModal.show();
  });
  return noteElement;
}

function addNote() {
  const noteElement = createNoteElement();
  main.appendChild(noteElement);
  notes.push(noteElement);
}

function archiveNote(note) {
  archivedNotes.push(note);
  note.remove();
  displayArchivedNotes();
}

function displayArchivedNotes() {
  archivedNotesDiv.innerHTML = '';
  archivedNotes.forEach((note) => {
    const archivedNote = document.createElement('div');
    archivedNote.classList.add('archived-note', 'mb-2');
    archivedNote.innerHTML = note.innerHTML;
    archivedNotesDiv.appendChild(archivedNote);
  });
}

function shareNote(platform) {
  const noteTitle = sharedNote.querySelector('.title').value;
  const noteContent = sharedNote.querySelector('.content').value;
  let url = '';
  switch (platform) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(noteContent)}&quote=${encodeURIComponent(noteTitle)}`;
      break;
    case 'twitter':
      url = (window.location.href + '?' + encodeURIComponent(noteTitle) + '=' + encodeURIComponent(noteContent)).replace(/ /g, '%20');
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(noteTitle)}&url=${url}`, '_blank');
      return;
    case 'whatsapp':
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(noteTitle)}%0A${encodeURIComponent(noteContent)}`;
      break;
    case 'email':
      url = `mailto:?subject=${encodeURIComponent(noteTitle)}&body=${encodeURIComponent(noteContent)}`;
      break;
    default:
      return;
  }
  window.open(url, '_blank');
}

// Event Listeners
addBtn.addEventListener('click', addNote);
darkModeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
});
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const notesElements = document.querySelectorAll('.note');
  notesElements.forEach((note) => {
    const title = note.querySelector('.title').value.toLowerCase();
    const content = note.querySelector('.content').value.toLowerCase();
    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  });
});
reminderBtn.addEventListener('click', () => {
  reminderPopup.show();
});
setReminderBtn.addEventListener('click', () => {
  const reminderTime = reminderInput.value;
  if (reminderTime) {
    const reminderElement = document.createElement('p');
    reminderElement.classList.add('reminder');
    reminderElement.textContent = `Reminder: ${reminderTime}`;
    reminderNote.appendChild(reminderElement);
    reminderPopup.hide();
  }
});
archiveBtn.addEventListener('click', () => {
  archivePopup.show();
  displayArchivedNotes();
});
yesBtn.addEventListener('click', () => {
  if (noteToDelete) {
    noteToDelete.remove();
    noteToDelete = null;
  }
  popup.hide();
});
noBtn.addEventListener('click', () => {
  popup.hide();
});
shareBtn.addEventListener('click', () => {
  shareModal.show();
});
facebookBtn.addEventListener('click', () => {
  shareNote('facebook');
  shareModal.hide();
});
twitterBtn.addEventListener('click', () => {
  shareNote('twitter');
  shareModal.hide();
});
whatsappBtn.addEventListener('click', () => {
  shareNote('whatsapp');
  shareModal.hide();
});
emailBtn.addEventListener('click', () => {
  shareNote('email');
  shareModal.hide();
});