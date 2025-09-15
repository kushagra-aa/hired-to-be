import { UserSessionResponseType } from "@hiredtobe/shared/entities";

import { checkSessionAPI } from "@/client/lib/api/auth.api";

import { useAppQuery } from "./useAppQuery";

export function useSession() {
  return useAppQuery<UserSessionResponseType | null, unknown[]>({
    queryKey: ["session"],
    queryFn: checkSessionAPI,
    staleTime: 1000 * 60 * 5, // 5 minutes (data considered fresh)
    refetchInterval: (data) => {
      // Only poll if user is logged in
      if (data?.state?.data) return 1000 * 60 * 1; // every 10 minutes
      return false; // don’t poll if not logged in
    },
    refetchOnWindowFocus: true, // re-check when tab is focused
    refetchOnReconnect: true, // re-check when network reconnects
    retry: false, // don’t retry on 401/unauthenticated
  });
}
