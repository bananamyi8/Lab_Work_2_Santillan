import { useState } from "react";
import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";

function Home({ todos, onAdd, onToggle, onDelete }) {
  const [filter, setFilter] = useState("all");

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

      <AddTodoForm onAdd={onAdd} />

      <div>
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button onClick={() => setFilter("completed")}>
          Completed
        </button>
      </div>

      <TodoList
        todos={visibleTodos}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </div>
  );
}

export default Home;