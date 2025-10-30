import { APIClient } from "@hiredtobe/shared/api";
import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

const client = new APIClient("/api/organizations");

export async function getOrganizationsAPI(
  cursor: number | null,
): Promise<SuccessResponseType<OrganizationEntity[]>> {
  const resp = await client.get<OrganizationEntity[]>(
    `?${cursor ? `?cursor=${cursor}` : ""}`,
  );
  return resp;
}

export async function addOrganizationAPI(
  payload: OrganizationAddPayloadType,
): Promise<SuccessResponseType<OrganizationEntity>> {
  const resp = await client.post<OrganizationEntity>("", payload);
  return resp;
}

export async function editOrganizationAPI(
  id: OrganizationEntity["id"],
  payload: OrganizationEditPayloadType,
): Promise<SuccessResponseType<OrganizationEntity>> {
  const resp = await client.patch<OrganizationEntity>(`/${id}`, payload);
  return resp;
}

export async function deleteOrganizationAPI(
  id: OrganizationEntity["id"],
): Promise<SuccessResponseType<OrganizationEntity>> {
  const resp = await client.delete<OrganizationEntity>(`/${id}`);
  return resp;
}
