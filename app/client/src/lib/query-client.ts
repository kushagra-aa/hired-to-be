import { ApiError } from "@shared/lib/api/index.js";
import { QueryClient } from "@tanstack/react-query";

export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ Don’t refetch too aggressively
      staleTime: 1000 * 60 * 1, // 1 min
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const err = error as ApiError;
        // Don’t retry on client errors
        if (err.statusCode && err.statusCode < 500) return false;
        return failureCount < 2; // retry up to 2 times on 5xx/network
      },
    },
    mutations: {
      retry: false, // ✅ don’t retry mutations by default
    },
  },
});
