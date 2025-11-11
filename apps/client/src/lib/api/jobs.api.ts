import { APIClient } from "@hiredtobe/shared/api";
import {
  JobAddPayloadType,
  JobEditPayloadType,
  JobEntity,
  JobFullEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

const client = new APIClient("/api/jobs");

export async function getJobsAPI(
  cursor: number | null,
  extend: string[] = [],
): Promise<SuccessResponseType<JobFullEntity[]>> {
  const params = `&extend=${extend.join(",")}`;
  const resp = await client.get<JobFullEntity[]>(
    `?${cursor ? `?cursor=${cursor}` : ""}${params}`,
  );
  return resp;
}

export async function getJobByIDAPI(
  id: string,
  extend: string[] = [],
): Promise<SuccessResponseType<JobFullEntity>> {
  const params = `extend=${extend.join(",")}`;
  const resp = await client.get<JobFullEntity>(`/${id}?${params}`);
  return resp;
}

export async function addJobAPI(
  payload: Omit<JobAddPayloadType, "status">,
): Promise<SuccessResponseType<JobEntity>> {
  const resp = await client.post<JobEntity>("", payload);
  return resp;
}

export async function editJobAPI(
  id: JobEntity["id"],
  payload: JobEditPayloadType,
): Promise<SuccessResponseType<JobEntity>> {
  const resp = await client.patch<JobEntity>(`/${id}`, payload);
  return resp;
}

export async function editJobStatusAPI(
  id: JobEntity["id"],
  payload: { status: JobEntity["status"] },
): Promise<SuccessResponseType<JobEntity>> {
  const resp = await client.patch<JobEntity>(`/${id}/status`, payload);
  return resp;
}

export async function deleteJobAPI(
  id: JobEntity["id"],
): Promise<SuccessResponseType<JobEntity>> {
  const resp = await client.delete<JobEntity>(`/${id}`);
  return resp;
}
