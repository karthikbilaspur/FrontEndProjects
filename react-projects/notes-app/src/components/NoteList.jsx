import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, onDelete, onEdit }) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>No notes found. Try adjusting your filter or adding a new note!</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map(note => (
        <NoteItem key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default NoteList;