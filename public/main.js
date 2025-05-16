const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todoList");

async function getTodos() {
  const res = await fetch("/todos");
  const todos = await res.json();

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", async () => {
      await toggleTodo(todo.id);
      if (checkbox.checked) {
        taskText.style.textDecoration = "line-through";
      } else {
        taskText.style.textDecoration = "none";
      }
    });

    const taskText = document.createElement("span");
    taskText.innerText = todo.task;
    if (todo.completed) {
      taskText.style.textDecoration = "line-through";
    }

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "X";
    removeBtn.addEventListener("click", async () => {
      await deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(removeBtn);

    todoList.appendChild(li);
  });
}

async function addTask() {
  const task = taskInput.value;
  if (!task) {
    alert("Task is missing...");
    return;
  }
  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  taskInput.value = "";
  getTodos();
}

async function toggleTodo(id) {
  await fetch(`/todos/${id}`, { method: "PUT" });
  getTodos();
}

async function deleteTodo(id) {
  await fetch(`/todos/${id}`, { method: "DELETE" });
  getTodos();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

document.addEventListener("DOMContentLoaded", getTodos);
