import { APIClient } from "@hiredtobe/shared/api";
import {
  JobDocumentAddPayloadType,
  JobDocumentEditPayloadType,
  JobDocumentEntity,
  JobEntity,
} from "@hiredtobe/shared/entities";
import { SuccessResponseType } from "@hiredtobe/shared/types";

const client = new APIClient("/api/jobs");

export async function getJobDocsAPI(
  jobID: JobEntity["id"],
): Promise<SuccessResponseType<JobDocumentEntity[]>> {
  const resp = await client.get<JobDocumentEntity[]>(`/${jobID}/docs`);
  return resp;
}

export async function addJobDocAPI(
  jobID: JobEntity["id"],
  payload: Omit<JobDocumentAddPayloadType, "status">,
): Promise<SuccessResponseType<JobDocumentEntity>> {
  const resp = await client.post<JobDocumentEntity>(`/${jobID}/docs`, payload);
  return resp;
}

export async function editJobDocAPI(
  jobID: JobEntity["id"],
  id: JobDocumentEntity["id"],
  payload: JobDocumentEditPayloadType,
): Promise<SuccessResponseType<JobDocumentEntity>> {
  const resp = await client.patch<JobDocumentEntity>(
    `/${jobID}/docs/${id}`,
    payload,
  );
  return resp;
}

export async function deleteJobDocAPI(
  jobID: JobEntity["id"],
  id: JobDocumentEntity["id"],
): Promise<SuccessResponseType<JobDocumentEntity>> {
  const resp = await client.delete<JobDocumentEntity>(`/${jobID}/docs/${id}`);
  return resp;
}
