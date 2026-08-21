import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <span
        style={{
          textDecoration: todo.done ? "line-through" : "none",
          marginRight: "15px"
        }}
      >
        {todo.text}
      </span>

      <button onClick={() => onToggle(todo.id)}>
        {todo.done ? "Undo" : "Complete"}
      </button>

      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

function Home({ todos, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim() === "") {
      return;
    }

    onAdd(text);
    setText("");
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.done;
    }

    if (filter === "completed") {
      return todo.done;
    }

    return true;
  });

  return (
    <div>
      <h2>My Todos</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
        />

        <button type="submit">
          Add
        </button>
      </form>

      <br />

      <button onClick={() => setFilter("all")}>
        All
      </button>

      <button onClick={() => setFilter("active")}>
        Active
      </button>

      <button onClick={() => setFilter("completed")}>
        Completed
      </button>

      <br />
      <br />

      {visibleTodos.length === 0 ? (
        <p>No todos here. Add one above!</p>
      ) : (
        <ul>
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Stats({ todos }) {
  const completed = todos.filter(
    (todo) => todo.done
  ).length;

  return (
    <div>
      <h2>Stats</h2>

      <p>Total todos: {todos.length}</p>
      <p>Completed: {completed}</p>
      <p>Remaining: {todos.length - completed}</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About This App</h2>

      <p>
        A todo app built while learning React fundamentals.
      </p>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((response) => response.json())
      .then((data) => {
        const formattedTodos = data.map((todo) => ({
          id: todo.id,
          text: todo.text,
          done: todo.completed
        }));

        setTodos(formattedTodos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading todos:", error);
        setLoading(false);
      });
  }, []);

  async function handleAddTodo(text) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: text
          })
        }
      );

      const newTodo = await response.json();

      setTodos((currentTodos) => [
        ...currentTodos,
        {
          id: newTodo.id,
          text: newTodo.text,
          done: newTodo.completed
        }
      ]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function handleToggle(id) {
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/todos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !todo.done
        })
      }
    );

    const updatedTodo = await response.json();

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              done: updatedTodo.completed
            }
          : todo
      )
    );
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

  async function handleDelete(id) {
  try {
    await fetch(
      `http://localhost:3000/api/todos/${id}`,
      {
        method: "DELETE"
      }
    );

    setTodos((currentTodos) =>
      currentTodos.filter(
        (todo) => todo.id !== id
      )
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

  if (loading) {
    return <p>Loading todos...</p>;
  }

  return (
    <BrowserRouter>
      <div>
        <h1>My Todo App</h1>

        <nav>
          <Link to="/">Home</Link>
          {" | "}
          <Link to="/stats">Stats</Link>
          {" | "}
          <Link to="/about">About</Link>
        </nav>

        <hr />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                todos={todos}
                onAdd={handleAddTodo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            }
          />

          <Route
            path="/stats"
            element={
              <Stats todos={todos} />
            }
          />

          <Route
            path="/about"
            element={
              <About />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;