import {
  JobDocumentAddPayloadType,
  JobDocumentEditPayloadType,
  JobDocumentEntity,
  JobEntity,
} from "@hiredtobe/shared/entities";

import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import {
  addJobDocAPI,
  deleteJobDocAPI,
  editJobDocAPI,
  getJobDocsAPI,
} from "../lib/api/jobDocs.api";
import { useAppMutation, useAppQuery } from "./useAppQuery";
import { JOB_KEY } from "./useJobs";

// Query Keys
const JOB_DOCS_KEY = (userId?: number, ...args: string[]) => [
  "job_docs",
  userId,
  ...args,
];

// Fetch Jobs
export function useJobDocs({ jobID }: { jobID: JobEntity["id"] }) {
  const { user } = useAuth();
  return useAppQuery<JobDocumentEntity[], ReturnType<typeof JOB_DOCS_KEY>>({
    queryKey: JOB_DOCS_KEY(user?.id, String(jobID)),
    queryFn: () => getJobDocsAPI(jobID),
    enabled: !!user?.id,
  });
}

// Add Job
export function useAddJobDoc({ jobID }: { jobID: JobEntity["id"] }) {
  const { user } = useAuth();

  return useAppMutation<
    JobDocumentEntity, // success type
    Omit<JobDocumentAddPayloadType, "status"> // variables type (title)
  >({
    mutationFn: async (data: Omit<JobDocumentAddPayloadType, "status">) => {
      return addJobDocAPI(
        jobID,
        { ...data },
        // token  // Can take Token from store for Bearer Style Auth
      );
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_DOCS_KEY(user?.id, String(jobID)),
      });
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id, String(jobID)),
      });
    },
  });
}

// Update Job
export function useUpdateJobDoc({ jobID }: { jobID: JobEntity["id"] }) {
  const { user } = useAuth();

  return useAppMutation<
    JobDocumentEntity, // success type
    { id: number; data: JobDocumentEditPayloadType } // variables type (title)
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: JobDocumentEditPayloadType;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return editJobDocAPI(jobID, id, { ...data });
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_DOCS_KEY(user?.id, String(jobID)),
      });
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id, String(jobID)),
      });
    },
  });
}

// Delete Job
export function useDeleteJobDoc({ jobID }: { jobID: JobEntity["id"] }) {
  const { user } = useAuth();

  return useAppMutation<
    { id: number }, // success type
    number // variables type (title)
  >({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      return deleteJobDocAPI(jobID, id); // pass user_id for ownership check
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: JOB_DOCS_KEY(user?.id, String(jobID)),
      });
      void appQueryClient.invalidateQueries({
        queryKey: JOB_KEY(user?.id, String(jobID)),
      });
    },
  });
}
