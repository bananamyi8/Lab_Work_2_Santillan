const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let todos = [
    { id: 1, text: "Learn Express", completed: false },
    { id: 2, text: "Build a REST API", completed: false }
];

app.get("/api/todos", (req, res) => {
    res.json(todos);
});

app.post("/api/todos", (req, res) => {
    const newTodo = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    todos.push(newTodo);
    res.json(newTodo);
});

const PORT = 3000;

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  todo.completed = req.body.completed;

  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  const todoIndex = todos.findIndex(
    (todo) => todo.id === id
  );

  if (todoIndex === -1) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  const deletedTodo = todos.splice(todoIndex, 1);

  res.json(deletedTodo[0]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});