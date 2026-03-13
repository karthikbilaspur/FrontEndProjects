import React, { useState, useEffect } from 'react';

const MAX_DESCRIPTION_LENGTH = 1000;

function TaskForm({ currentTask, onSave, onClearForm, isEditing = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium'); // Default priority
  const [theme, setTheme] = useState('light'); // For dynamic placeholders

  useEffect(() => {
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
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setDueDate(currentTask.dueDate || '');
      setPriority(currentTask.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  }, [currentTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() ||!description.trim() ||!dueDate) {
        alert('Please fill in all required fields (Title, Description, Due Date).');
        return;
    }
    onSave({...currentTask, title, description, dueDate, priority });
    if (!isEditing) { // Only clear form if it's a new task, not an inline edit
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('medium');
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const titlePlaceholder = theme === 'dark'? 'Task Title (Dark Mode)' : 'Task Title';
  const descriptionPlaceholder = theme === 'dark'? `Task Description (Max ${MAX_DESCRIPTION_LENGTH}, Dark Mode)` : `Task Description (Max ${MAX_DESCRIPTION_LENGTH})`;

  return (
    <form onSubmit={handleSubmit} className={isEditing? "task-edit-form" : "task-form"}>
      <input
        type="text"
        placeholder={titlePlaceholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder={descriptionPlaceholder}
        value={description}
        onChange={handleDescriptionChange}
        maxLength={MAX_DESCRIPTION_LENGTH}
        required
      ></textarea>
      <div className="char-count" style={{marginBottom: '10px', fontSize: '0.8em', color: 'var(--empty-state-color)'}}>
        {description.length}/{MAX_DESCRIPTION_LENGTH} characters
      </div>
      <div className="form-row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="button-primary">
          {currentTask? 'Update Task' : 'Add Task'}
        </button>
        {isEditing && ( // Show cancel button when editing
          <button type="button" onClick={onClearForm} className="button-secondary">
            Cancel
          </button>
        )}
        {!isEditing && currentTask && ( // Show clear form button for new task creation when editing existing
             <button type="button" onClick={onClearForm} className="button-secondary">
                Clear Form
             </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;