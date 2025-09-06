import Button from "@client/components/ui/Button/index.js";
import Loader from "@client/components/ui/Loader.js";
import {
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "@client/hooks/useTodos.js";

export function TodoList() {
  const { data: todos, isLoading, isError } = useTodos();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  if (isLoading) return <Loader variant="clip" size="md" />;
  if (isError) return <p>❌ Failed to load todos</p>;

  return (
    <ul style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {todos?.data.map((todo) => (
        <li key={todo.id} style={{ display: "flex", gap: "1rem" }}>
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {"->"}
          </span>
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </span>
          <Button
            variant="secondary"
            onClick={() =>
              updateTodo.mutate({
                id: todo.id,
                data: { completed: !todo.completed },
              })
            }
          >
            {updateTodo.isPending ? (
              <Loader variant="clip" size={"xs"} color="secondary" />
            ) : (
              "Toggle"
            )}
          </Button>
          <Button variant="danger" onClick={() => deleteTodo.mutate(todo.id)}>
            {deleteTodo.isPending ? (
              <Loader variant="clip" size={"xs"} color="secondary" />
            ) : (
              "Delete"
            )}
          </Button>
        </li>
      ))}
    </ul>
  );
}
