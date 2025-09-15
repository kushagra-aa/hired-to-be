// import { appQueryClient } from "@client/lib/query-client.js";
// import { useAuth } from "@client/stores/auth.store.js";

// import { useAppMutation, useAppQuery } from "./useAppQuery.js";

// import { addTodo, deleteTodo, getTodos, updateTodo } from "@/lib/api/todos.api";
// import type {
//   TodoEntity,
//   TodoResponseType,
//   TodoUpdatePayloadType,
// } from "@/types/entities/todos.entity";

// // Query Keys
// const TODOS_KEY = (userId?: number) => ["todos", userId];

// // Fetch Todos
// export function useTodos() {
//   const { user } = useAuth();
//   return useAppQuery<TodoResponseType[], ReturnType<typeof TODOS_KEY>>({
//     queryKey: TODOS_KEY(user?.id),
//     queryFn: getTodos,
//   });
// }

// // Add Todo
// export function useAddTodo() {
//   const { user } = useAuth();

//   return useAppMutation<
//     TodoEntity, // success type
//     string // variables type (title)
//   >({
//     mutationFn: async (title: string) => {
//       return addTodo(
//         { title, user_id: user!.id },
//         // token  // Can take Token from store for Bearer Style Auth
//       );
//     },
//     onSuccess: () => {
//       appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
//     },
//   });
// }

// // Update Todo
// export function useUpdateTodo() {
//   const { user } = useAuth();

//   return useAppMutation<
//     TodoEntity, // success type
//     { id: number; data: TodoUpdatePayloadType } // variables type (title)
//   >({
//     mutationFn: async ({
//       id,
//       data,
//     }: {
//       id: number;
//       data: TodoUpdatePayloadType;
//     }) => {
//       if (!user) throw new Error("User not authenticated");
//       return updateTodo(id, { ...data });
//     },
//     onSuccess: () => {
//       appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
//     },
//   });
// }

// // Delete Todo
// export function useDeleteTodo() {
//   const { user } = useAuth();

//   return useAppMutation<
//     { id: number }, // success type
//     number // variables type (title)
//   >({
//     mutationFn: async (id: number) => {
//       if (!user) throw new Error("User not authenticated");
//       return deleteTodo(id); // pass user_id for ownership check
//     },
//     onSuccess: () => {
//       appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
//     },
//   });
// }
