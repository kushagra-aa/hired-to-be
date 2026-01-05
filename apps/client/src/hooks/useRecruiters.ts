import {
  RecruiterAddPayloadType,
  RecruiterEditPayloadType,
  RecruiterEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

import {
  addRecruiterAPI,
  deleteRecruiterAPI,
  editRecruiterAPI,
  getRecruitersAPI,
} from "@/client/lib/api/recruiters.api";
import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import { useAppInfiniteQuery, useAppMutation } from "./useAppQuery";

// Query Keys
const RECRUITER_KEY = (userId?: number, ...args: string[]) => [
  "recruiters",
  userId,
  ...args,
];

// Fetch Recruiters
export function useRecruiters() {
  const { user } = useAuth();
  return useAppInfiniteQuery<
    SuccessResponseType<RecruiterEntity[]>,
    ReturnType<typeof RECRUITER_KEY>
  >({
    queryKey: RECRUITER_KEY(user?.id),
    queryFn: ({ pageParam }) => getRecruitersAPI(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      // Return nextCursor if hasMore is true, otherwise undefined
      return lastPage?.cursorPagination?.hasMore
        ? lastPage?.cursorPagination.nextCursor
        : undefined;
    },
    enabled: !!user?.id,
  });
}

// Add Recruiter
export function useAddRecruiter() {
  const { user } = useAuth();

  return useAppMutation<
    RecruiterEntity, // success type
    RecruiterAddPayloadType // variables type (title)
  >({
    mutationFn: async (data: RecruiterAddPayloadType) => {
      return addRecruiterAPI(
        { ...data },
        // token  // Can take Token from store for Bearer Style Auth
      );
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: RECRUITER_KEY(user?.id),
      });
    },
  });
}

// Update Recruiter
export function useUpdateRecruiter() {
  const { user } = useAuth();

  return useAppMutation<
    RecruiterEntity, // success type
    { id: number; data: RecruiterEditPayloadType } // variables type (title)
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: RecruiterEditPayloadType;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return editRecruiterAPI(id, { ...data });
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: RECRUITER_KEY(user?.id),
      });
    },
  });
}

// Delete Recruiter
export function useDeleteRecruiter() {
  const { user } = useAuth();

  return useAppMutation<
    { id: number }, // success type
    number // variables type (title)
  >({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      return deleteRecruiterAPI(id); // pass user_id for ownership check
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: RECRUITER_KEY(user?.id),
      });
    },
  });
}
