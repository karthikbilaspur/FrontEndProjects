import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import './index.css'; // Global styles
import './App.css'; // App-specific styles

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'title-asc', 'title-desc'
  const [filterText, setFilterText] = useState('');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme? savedTheme : 'light';
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSaveNote = (note) => {
    if (note.id) {
      setNotes(notes.map(n => (n.id === note.id? {...n,...note, updated: Date.now() } : n)));
    } else {
      setNotes([...notes, {...note, id: Date.now(), created: Date.now(), updated: Date.now() }]);
    }
    setCurrentNote(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id!== id));
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
  };

  const handleClearForm = () => {
    setCurrentNote(null);
  };

  const sortNotes = (unsortedNotes) => {
    const sorted = [...unsortedNotes];
    switch (sortOrder) {
      case 'newest':
        return sorted.sort((a, b) => b.created - a.created);
      case 'oldest':
        return sorted.sort((a, b) => a.created - b.created);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(filterText.toLowerCase()) ||
    note.content.toLowerCase().includes(filterText.toLowerCase())
  );

  const displayedNotes = sortNotes(filteredNotes);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light'? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Notes App</h1>
        <div className="controls">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select id="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
          <button className="dark-mode-toggle" onClick={toggleTheme}>
            {theme === 'light'? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </header>
      <NoteForm currentNote={currentNote} onSave={handleSaveNote} onClearForm={handleClearForm} />

      <div className="filter-notes">
        <input
          type="text"
          placeholder="Filter notes by keyword..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <NoteList notes={displayedNotes} onDelete={handleDeleteNote} onEdit={handleEditNote} />
    </div>
  );
}

export default App;