const express = require("express");
const mongoose = require("mongoose");
const pool = require("./db");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tododb_mongo")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/api/todos", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM todos ORDER BY id"
    );

    res.json(result.rows);
});


app.post("/api/todos", async (req, res) => {
    const result = await pool.query(
        "INSERT INTO todos (text) VALUES ($1) RETURNING *",
        [req.body.text]
    );

    res.json(result.rows[0]);
});

app.get("/api/todos-mongo", async (req, res) => {
    const todos = await Todo.find();

    res.json(todos);
});

app.post("/api/todos-mongo", async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    });

    await newTodo.save();

    res.json(newTodo);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});