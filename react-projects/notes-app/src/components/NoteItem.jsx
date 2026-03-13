import React from 'react';

function NoteItem({ note, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the note titled "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="timestamps">
        <span>Created: {formatTimestamp(note.created)}</span>
        <span>Updated: {formatTimestamp(note.updated)}</span>
      </div>
      <div className="note-actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default NoteItem;