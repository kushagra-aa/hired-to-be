import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
} from "@hiredtobe/shared/entities";

import {
  addOrganizationAPI,
  deleteOrganizationAPI,
  editOrganizationAPI,
  getOrganizationsAPI,
} from "@/client/lib/api/organizations.api";
import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import { useAppMutation, useAppQuery } from "./useAppQuery";

// Query Keys
const TODOS_KEY = (userId?: number) => ["todos", userId];

// Fetch Organizations
export function useOrganizations() {
  const { user } = useAuth();
  return useAppQuery<OrganizationEntity[], ReturnType<typeof TODOS_KEY>>({
    queryKey: TODOS_KEY(user?.id),
    queryFn: getOrganizationsAPI,
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
      void appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
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
      void appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
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
      void appQueryClient.invalidateQueries({ queryKey: TODOS_KEY(user?.id) });
    },
  });
}
