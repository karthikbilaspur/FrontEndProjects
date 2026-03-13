import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import './Column.css';

function Column({ column, tasks, index, onDeleteTask, onEditTask }) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <h2 {...provided.dragHandleProps}>{column.title}</h2>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`task-list ${snapshot.isDraggingOver? 'is-dragging-over' : ''}`}
              >
                {tasks.length === 0 && <p className="column-empty">No tasks here!</p>}
                {tasks.map((task, taskIndex) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={taskIndex}
                    columnId={column.id}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;