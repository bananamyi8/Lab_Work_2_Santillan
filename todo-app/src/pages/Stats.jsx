function Stats({ todos }) {
  const completed = todos.filter(
    (todo) => todo.done
  ).length;

  return (
    <div>
      <h2>Stats</h2>

      <p>Total todos: {todos.length}</p>

      <p>Completed: {completed}</p>

      <p>
        Remaining: {todos.length - completed}
      </p>
    </div>
  );
}

export default Stats;