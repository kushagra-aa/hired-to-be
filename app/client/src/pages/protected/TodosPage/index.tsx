import { TodoForm } from "@client/components/todo/TodoForm.js";
import { TodoList } from "@client/components/todo/TodoList.js";

export default function TodosPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>✅ Todos</h1>
      <div style={{ marginBottom: "2rem" }}>
        <TodoForm />
      </div>
      <TodoList />
    </div>
  );
}
