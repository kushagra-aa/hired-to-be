import {
  JobAddPayloadType,
  JobEditPayloadType,
  JobEntity,
  JobFullEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

import {
  addJobAPI,
  deleteJobAPI,
  editJobAPI,
  getJobsAPI,
} from "@/client/lib/api/jobs.api";
import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import { useAppInfiniteQuery, useAppMutation } from "./useAppQuery";

// Query Keys
const JOB_KEY = (userId?: number) => ["jobs", userId];

// Fetch Jobs
export function useJobs() {
  const { user } = useAuth();
  return useAppInfiniteQuery<
    SuccessResponseType<JobFullEntity[]>,
    ReturnType<typeof JOB_KEY>
  >({
    queryKey: JOB_KEY(user?.id),
    queryFn: ({ pageParam }) => getJobsAPI(pageParam, ["organization"]),
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

// Add Job
export function useAddJob() {
  const { user } = useAuth();

  return useAppMutation<
    JobEntity, // success type
    Omit<JobAddPayloadType, "status"> // variables type (title)
  >({
    mutationFn: async (data: Omit<JobAddPayloadType, "status">) => {
      return addJobAPI(
        { ...data },
        // token  // Can take Token from store for Bearer Style Auth
      );
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id),
      });
    },
  });
}

// Update Job
export function useUpdateJob() {
  const { user } = useAuth();

  return useAppMutation<
    JobEntity, // success type
    { id: number; data: JobEditPayloadType } // variables type (title)
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: JobEditPayloadType;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return editJobAPI(id, { ...data });
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id),
      });
    },
  });
}

// Delete Job
export function useDeleteJob() {
  const { user } = useAuth();

  return useAppMutation<
    { id: number }, // success type
    number // variables type (title)
  >({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      return deleteJobAPI(id); // pass user_id for ownership check
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id),
      });
    },
  });
}
