function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">

      <span
        onClick={() => onToggle(todo.id)}
        style={{
          textDecoration: todo.done
            ? "line-through"
            : "none",
          cursor: "pointer",
        }}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>

    </li>
  );
}

export default TodoItem;