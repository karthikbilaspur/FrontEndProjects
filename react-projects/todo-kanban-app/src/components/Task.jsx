import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskForm from './TaskForm'; // For inline editing
import './Task.css';

function Task({ task, index, columnId, onDeleteTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      default: return '';
    }
  };

  const handleSaveEdit = (updatedTask) => {
    onEditTask(updatedTask); // This will update the task in App.jsx
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-item ${snapshot.isDragging? 'is-dragging' : ''}`}
        >
          {isEditing? (
            <TaskForm
              currentTask={task}
              onSave={handleSaveEdit}
              onClearForm={() => setIsEditing(false)} // Treat clear as cancel
              isEditing={true} // Pass a prop to indicate editing mode
            />
          ) : (
            <>
              <h3>{task.title}</h3>
              <div className="task-meta">
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                {task.priority && <span className={`tag ${getPriorityClass(task.priority)}`}>{task.priority.toUpperCase()}</span>}
                {task.completed && <span className="tag completed">COMPLETED</span>}
              </div>
              <p>{task.description}</p>
              <div className="task-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button className="button-danger" onClick={() => onDeleteTask(task.id, columnId)}>Delete</button>
              </div>
              <div className="task-timestamps" style={{fontSize: '0.75em', color: 'var(--empty-state-color)', marginTop: '10px', paddingTop: '5px', borderTop: '1px solid var(--border-color-light)'}}>
                <span>Created: {formatDateTime(task.created)}</span>
                <span>Updated: {formatDateTime(task.updated)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;