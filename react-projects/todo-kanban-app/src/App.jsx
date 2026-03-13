import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import "./index.css";
import "./App.css";

const initialColumns = {
  todo: { id: "todo", title: "To Do", taskIds: [] },
  "in-progress": { id: "in-progress", title: "In Progress", taskIds: [] },
  done: { id: "done", title: "Done", taskIds: [] },
};

function App() {
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useState([
    "todo",
    "in-progress",
    "done",
  ]);
  const [currentTask, setCurrentTask] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("dueDateAsc");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedColumns = localStorage.getItem("columns");
    const savedColumnOrder = localStorage.getItem("columnOrder");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedColumns) setColumns(JSON.parse(savedColumns));
    if (savedColumnOrder) setColumnOrder(JSON.parse(savedColumnOrder));

    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      setColumnOrder(newColumnOrder);
      return;
    }

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);

    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(endColumn.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);

    const newEndColumn = {
      ...endColumn,
      taskIds: endTaskIds,
    };

    setColumns({
      ...columns,
      [newStartColumn.id]: newStartColumn,
      [newEndColumn.id]: newEndColumn,
    });

    if (endColumn.id === "done") {
      setTasks((prev) => ({
        ...prev,
        [draggableId]: { ...prev[draggableId], completed: true },
      }));
    } else if (startColumn.id === "done" && endColumn.id !== "done") {
      setTasks((prev) => ({
        ...prev,
        [draggableId]: { ...prev[draggableId], completed: false },
      }));
    }
  };

  const handleSaveTask = (task) => {
    const taskId = task.id || Date.now().toString();

    const newTask = {
      ...task,
      id: taskId,
      created: task.created || Date.now(),
      updated: Date.now(),
    };

    setTasks((prev) => ({
      ...prev,
      [taskId]: newTask,
    }));

    if (!task.id) {
      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          taskIds: [...prev.todo.taskIds, taskId],
        },
      }));
    }

    setCurrentTask(null);
  };

  const handleDeleteTask = (taskId, columnId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => {
        const newTasks = { ...prev };
        delete newTasks[taskId];
        return newTasks;
      });

      setColumns((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          taskIds: prev[columnId].taskIds.filter((id) => id !== taskId),
        },
      }));
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
  };

  const handleClearForm = () => {
    setCurrentTask(null);
  };

  const getSortedAndFilteredTasks = (columnId) => {
    let columnTasks = columns[columnId].taskIds
      .map((taskId) => tasks[taskId])
      .filter(Boolean);

    if (filterText) {
      columnTasks = columnTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterText.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(filterText.toLowerCase()))
      );
    }

    if (filterCategory !== "all" && columnId !== filterCategory) {
      columnTasks = [];
    }

    switch (sortOrder) {
      case "dueDateAsc":
        columnTasks.sort(
          (a, b) =>
            new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
        );
        break;

      case "dueDateDesc":
        columnTasks.sort(
          (a, b) =>
            new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
        );
        break;

      case "priorityHigh":
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        columnTasks.sort(
          (a, b) =>
            (priorityOrder[a.priority] || 4) -
            (priorityOrder[b.priority] || 4)
        );
        break;

      default:
        break;
    }

    return columnTasks;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kanban To-Do Board</h1>

        <div className="controls">
          <button className="button-secondary" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </header>

      <TaskForm
        currentTask={currentTask}
        onSave={handleSaveTask}
        onClearForm={handleClearForm}
      />

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter tasks..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>

          {columnOrder.map((columnId) => (
            <option key={columnId} value={columnId}>
              {columns[columnId].title}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="dueDateAsc">Due Date (Asc)</option>
          <option value="dueDateDesc">Due Date (Desc)</option>
          <option value="priorityHigh">Priority (High first)</option>
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="kanban-board"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId];
                const tasksInColumn = getSortedAndFilteredTasks(columnId);

                if (filterCategory !== "all" && columnId !== filterCategory) {
                  return null;
                }

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasksInColumn}
                    index={index}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                  />
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
