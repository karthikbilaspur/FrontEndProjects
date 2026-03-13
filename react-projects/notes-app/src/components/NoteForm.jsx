import React, { useState, useEffect } from 'react';
import '../NoteForm.css'; // Import NoteForm specific styles

const MAX_CONTENT_LENGTH = 500; // Define max characters for content

function NoteForm({ currentNote, onSave, onClearForm }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('light'); // Local state for theme to affect placeholders

  useEffect(() => {
    // Listen for theme changes from localStorage or an observer if more complex
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
    // Basic listener for demonstration, for real app might use Context API or more robust solution
    const themeChangeListener = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };
    window.addEventListener('storage', themeChangeListener);
    return () => window.removeEventListener('storage', themeChangeListener);
  }, []);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() ||!content.trim()) return;
    onSave({...currentNote, title, content }); // Timestamp handled in App.jsx
    setTitle('');
    setContent('');
  };

  const handleClear = () => {
    onClearForm();
    setTitle('');
    setContent('');
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value);
    }
  };

  const titlePlaceholder = theme === 'dark'? 'Note Title (Dark Mode)' : 'Note Title';
  const contentPlaceholder = theme === 'dark'? `Note Content (Max ${MAX_CONTENT_LENGTH}, Dark Mode)` : `Note Content (Max ${MAX_CONTENT_LENGTH})`;

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        placeholder={titlePlaceholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder={contentPlaceholder}
        value={content}
        onChange={handleContentChange}
        maxLength={MAX_CONTENT_LENGTH}
        required
      ></textarea>
      <div className="char-count">
        {content.length}/{MAX_CONTENT_LENGTH} characters
      </div>
      <div className="form-actions">
        <button type="submit">{currentNote? 'Update Note' : 'Add Note'}</button>
        {currentNote && (
          <button type="button" onClick={handleClear} className="clear-button">
            Clear Form
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;