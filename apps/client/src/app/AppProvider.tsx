import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { appQueryClient } from "../lib/query-client";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={appQueryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
