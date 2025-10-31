import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
  OrganizationOptionType,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

import {
  addOrganizationAPI,
  deleteOrganizationAPI,
  editOrganizationAPI,
  getOrganizationsAPI,
  getOrganizationsAsOptionsAPI,
} from "@/client/lib/api/organizations.api";
import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import {
  useAppInfiniteQuery,
  useAppMutation,
  useAppQuery,
} from "./useAppQuery";

// Query Keys
const ORGANIZATION_KEY = (userId?: number, ...args: string[]) => [
  "organizations",
  userId,
  ...args,
];

// Fetch Organizations
export function useOrganizations() {
  const { user } = useAuth();
  return useAppInfiniteQuery<
    SuccessResponseType<OrganizationEntity[]>,
    ReturnType<typeof ORGANIZATION_KEY>
  >({
    queryKey: ORGANIZATION_KEY(user?.id),
    queryFn: ({ pageParam }) => getOrganizationsAPI(pageParam),
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

export function useOrganizationsAsOptions() {
  const { user } = useAuth();
  return useAppQuery<
    OrganizationOptionType[],
    ReturnType<typeof ORGANIZATION_KEY>
  >({
    queryKey: ORGANIZATION_KEY(user?.id, "options"),
    queryFn: getOrganizationsAsOptionsAPI,
    enabled: !!user?.id,
  });
}

// Add Organization
export function useAddOrganization() {
  const { user } = useAuth();

  return useAppMutation<
    OrganizationEntity, // success type
    OrganizationAddPayloadType // variables type (title)
  >({
    mutationFn: async (data: OrganizationAddPayloadType) => {
      return addOrganizationAPI(
        { ...data },
        // token  // Can take Token from store for Bearer Style Auth
      );
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEY(user?.id),
      });
    },
  });
}

// Update Organization
export function useUpdateOrganization() {
  const { user } = useAuth();

  return useAppMutation<
    OrganizationEntity, // success type
    { id: number; data: OrganizationEditPayloadType } // variables type (title)
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: OrganizationEditPayloadType;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return editOrganizationAPI(id, { ...data });
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEY(user?.id),
      });
    },
  });
}

// Delete Organization
export function useDeleteOrganization() {
  const { user } = useAuth();

  return useAppMutation<
    { id: number }, // success type
    number // variables type (title)
  >({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      return deleteOrganizationAPI(id); // pass user_id for ownership check
    },
    onSuccess: () => {
      void appQueryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEY(user?.id),
      });
    },
  });
}
