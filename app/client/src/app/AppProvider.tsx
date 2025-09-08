import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { appQueryClient } from "@client/lib/query-client.js";

import AuthProvider from "./AuthProvider.js";
import { ThemeProvider } from "./ThemeProvider.js";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={appQueryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
