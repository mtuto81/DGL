// taskManager.ts
import { ComponentRenderer } from "../mod.ts";

// Task type definition
interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

// Application state
const state = {
  tasks: [] as Task[],
  filter: "all" as "all" | "todo" | "in-progress" | "done",
};

// Event handlers
function handleAddTask(title: string) {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    status: "todo",
    priority: "medium",
  };
  state.tasks.push(task);
  updateTaskList();
}

function handleStatusChange(taskId: string, newStatus: Task["status"]) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    updateTaskList();
  }
}

function handleFilterChange(filter: typeof state.filter) {
  state.filter = filter;
  updateTaskList();
}

function updateTaskList() {
  const taskList = renderer.getComponent("taskList") as any;
  if (taskList) {
    const filteredTasks = state.filter === "all" 
      ? state.tasks 
      : state.tasks.filter(t => t.status === state.filter);
    
    // Update task list display
    // Note: In a real implementation, we would need to clear and rebuild the list
    console.log("Tasks updated:", filteredTasks);
  }
}

// Create renderer instance
const renderer = new ComponentRenderer();

// Register event handlers
renderer.registerEventHandler("addTask", () => {
  const input = renderer.getComponent("taskInput") as any;
  if (input) {
    const title = input.getText();
    if (title) {
      handleAddTask(title);
      input.setText("");
    }
  }
});

renderer.registerEventHandler("filterAll", () => handleFilterChange("all"));
renderer.registerEventHandler("filterTodo", () => handleFilterChange("todo"));
renderer.registerEventHandler("filterInProgress", () => handleFilterChange("in-progress"));
renderer.registerEventHandler("filterDone", () => handleFilterChange("done"));

// Define the UI
const appDefinition = {
  type: "window",
  title: "DeskCraft Task Manager",
  width: 800,
  height: 600,
  children: [{
    type: "box",
    orientation: "vertical",
    spacing: 10,
    children: [
      // Header
      {
        type: "label",
        text: "Task Management System",
        id: "header"
      },
      // Input section
      {
        type: "box",
        orientation: "horizontal",
        spacing: 5,
        children: [
          {
            type: "entry",
            id: "taskInput",
            placeholder: "Enter new task..."
          },
          {
            type: "button",
            label: "Add Task",
            onClick: "addTask"
          }
        ]
      },
      // Filters
      {
        type: "box",
        orientation: "horizontal",
        spacing: 5,
        children: [
          {
            type: "label",
            text: "Filter:"
          },
          {
            type: "button",
            label: "All",
            onClick: "filterAll"
          },
          {
            type: "button",
            label: "Todo",
            onClick: "filterTodo"
          },
          {
            type: "button",
            label: "In Progress",
            onClick: "filterInProgress"
          },
          {
            type: "button",
            label: "Done",
            onClick: "filterDone"
          }
        ]
      },
      // Task list container
      {
        type: "box",
        orientation: "vertical",
        spacing: 5,
        id: "taskList",
        children: []
      }
    ]
  }]
};

// Start the application
renderer.render(appDefinition);