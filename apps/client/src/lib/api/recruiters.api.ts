import { APIClient } from "@hiredtobe/shared/api";
import {
  RecruiterAddPayloadType,
  RecruiterEditPayloadType,
  RecruiterEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

const client = new APIClient("/api/recruiters");

export async function getRecruitersAPI(
  cursor: number | null,
  extend: string[] = [],
): Promise<SuccessResponseType<RecruiterEntity[]>> {
  const params = `&extend=${extend.join(",")}`;
  const resp = await client.get<RecruiterEntity[]>(
    `?${cursor ? `?cursor=${cursor}` : ""}${params}`,
  );
  return resp;
}

export async function getRecruiterByIDAPI(
  id: string,
  extend: string[] = [],
): Promise<SuccessResponseType<RecruiterEntity>> {
  const params = `extend=${extend.join(",")}`;
  const resp = await client.get<RecruiterEntity>(`/${id}?${params}`);
  return resp;
}

export async function addRecruiterAPI(
  payload: Omit<RecruiterAddPayloadType, "status">,
): Promise<SuccessResponseType<RecruiterEntity>> {
  const resp = await client.post<RecruiterEntity>("", payload);
  return resp;
}

export async function editRecruiterAPI(
  id: RecruiterEntity["id"],
  payload: RecruiterEditPayloadType,
): Promise<SuccessResponseType<RecruiterEntity>> {
  const resp = await client.patch<RecruiterEntity>(`/${id}`, payload);
  return resp;
}

export async function deleteRecruiterAPI(
  id: RecruiterEntity["id"],
): Promise<SuccessResponseType<RecruiterEntity>> {
  const resp = await client.delete<RecruiterEntity>(`/${id}`);
  return resp;
}
