import { useState } from "react";
import { toast } from "sonner";

import Button from "@client/components/ui/Button/index.js";
import { InputField } from "@client/components/ui/Form/Input/index.js";
import Loader from "@client/components/ui/Loader.js";
import { useAddTodo } from "@client/hooks/useTodos.js";

export function TodoForm() {
  const [title, setTitle] = useState("");
  const { mutate, isPending } = useAddTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutate(title, {
      onSuccess: () => setTitle(""),
      onError: (err) => {
        const errorData = err.data;

        if (errorData?.errors) {
          // Field-level errors
          errorData.errors.forEach((fieldError) => {
            Object.entries(fieldError).forEach(([field, msg]) => {
              // can populate form error Objects here
              toast.error(`Field ${field}: ${msg}`);
            });
          });
        } else {
          toast.error("Global error:" + errorData?.error);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem" }}>
      <InputField
        name=""
        label=""
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a todo..."
      />
      <Button type="submit" variant="primary">
        {isPending ? (
          <Loader variant="clip" size={"xs"} color="secondary" />
        ) : (
          "Add"
        )}
      </Button>
    </form>
  );
}
