import express from "express";
import path from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const fileName = path.join(__dirname, "todos.json");

function readJsonFile() {
  const file = fs.readFileSync(fileName, "utf-8");
  return JSON.parse(file);
}

function writeJsonFile(data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}

app.get("/todos", (req, res) => {
  res.send(readJsonFile());
});

app.post("/todos", (req, res) => {
  try {
    const data = readJsonFile();

    if (!req.body.task || req.body.task.trim() === "") {
      return res.status(400).send("Task is missing!");
    }

    const newTask = {
      id: uuidv4(),
      task: req.body.task,
      completed: false,
    };

    data.push(newTask);
    writeJsonFile(data);
    res.status(201).send(newTask);
  } catch (error) {
    console.error("Error creating new task", error);

    res.status(500).send("Internal Server Error");
  }
});

app.delete("/todos/:id", (req, res) => {
  let todos = readJsonFile();

  todos = todos.filter((todo) => todo.id !== req.params.id);

  writeJsonFile(todos);
  res.sendStatus(200);
});

app.put("/todos/:id", (req, res) => {
  const todos = readJsonFile();

  const todo = todos.find((t) => t.id === req.params.id);

  if (todo) {
    todo.completed = !todo.completed;
    writeJsonFile(todos);
    res.send(todo);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
