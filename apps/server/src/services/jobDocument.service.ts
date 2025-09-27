import {
  JobDocumentAddPayloadType,
  JobDocumentEditPayloadType,
  JobDocumentEntity,
  JobDocumentResponseType,
  JobEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import { JobDocumentModelType } from "@/server/database/models";
import jobRepository from "@/server/repositories/job.repository";
import jobDocumentRepository from "@/server/repositories/jobDocument.repository";

const formatJobDocumentResponse = (
  jobDocument: JobDocumentModelType,
): JobDocumentResponseType => ({
  ...jobDocument,
});
const formatJobDocumentsResponse = (
  jobDocuments: JobDocumentModelType[],
): JobDocumentResponseType[] =>
  jobDocuments.map((jobDocument) => formatJobDocumentResponse(jobDocument));

const checkJob = async (
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
): ServiceReturnType<JobEntity> => {
  const job = await jobRepository.findJobByID(db, jobID, true);
  if (!job)
    return {
      error: "Not Found",
      message: "No Job Found with this ID",
      errors: { jobID: ["Job with this ID does not exist"] },
      status: 404,
    };
  if (job.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to access this job",
      status: 401,
    };
  return { data: job as JobEntity };
};

async function getUserJobDocumentsService(
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
): ServiceReturnType<JobDocumentEntity[]> {
  const job = await checkJob(db, jobID, userID);
  if (job?.error || !job.data) return job;
  const jobDocuments = await jobDocumentRepository.findJobDocumentsByUserId(
    db,
    jobID,
    userID,
    pageSize,
    cursor,
  );
  const [total] = await jobDocumentRepository.getTotalJobDocumentsByUserId(
    db,
    jobID,
    userID,
  );

  return {
    data: formatJobDocumentsResponse(jobDocuments.data),
    cursorPagination: {
      pageSize: pageSize || 10,
      hasMore: jobDocuments.hasMore,
      count: jobDocuments.data.length,
      nextCursor: jobDocuments.nextCursor,
      total: total.count,
    },
  };
}

async function getUserJobDocumentService(
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
  jobDocumentID: JobDocumentEntity["id"],
): ServiceReturnType<JobDocumentEntity> {
  const job = await checkJob(db, jobID, userID);
  if (job?.error || !job.data) return job;
  const jobDocument = await jobDocumentRepository.findJobDocumentByUserId(
    db,
    jobID,
    userID,
    jobDocumentID,
  );
  if (!jobDocument)
    return {
      error: "Not Found",
      message: "No JobDocument Found with this ID",
      status: 404,
    };

  return {
    data: formatJobDocumentResponse(jobDocument),
  };
}

async function addJobDocumentService(
  db: DbType,
  payload: JobDocumentAddPayloadType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
): ServiceReturnType<JobDocumentEntity> {
  const job = await checkJob(db, jobID, userID);
  if (job?.error || !job.data) return job;
  const [newJobDocument] = await jobDocumentRepository.addJobDocument(db, {
    ...payload,
    jobID,
    userID,
  });
  return { data: formatJobDocumentResponse(newJobDocument) };
}

async function editJobDocumentService(
  db: DbType,
  id: JobDocumentEntity["id"],
  payload: JobDocumentEditPayloadType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
): ServiceReturnType<JobDocumentEntity> {
  const jobDocument = await jobDocumentRepository.findJobDocumentByID(db, id);
  if (!jobDocument)
    return {
      error: "Not Found",
      message: "No JobDocument Found with this ID",
      status: 404,
    };
  if (!jobDocument.jobID || jobDocument.jobID !== jobID)
    return {
      error: "Not Found",
      message: "No JobDocument Found with this Job ID",
      status: 404,
    };
  if (!jobDocument.userID || jobDocument.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to edit this jobDocument",
      status: 401,
    };

  const [newJobDocument] = await jobDocumentRepository.editJobDocument(
    db,
    id,
    payload,
  );
  return { data: formatJobDocumentResponse(newJobDocument) };
}

async function deleteJobDocumentService(
  db: DbType,
  id: JobDocumentEntity["id"],
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
  isSoftDelete = true,
): ServiceReturnType<JobDocumentEntity> {
  const jobDocument = await jobDocumentRepository.findJobDocumentByID(db, id);
  if (!jobDocument)
    return {
      error: "Not Found",
      message: "No JobDocument Found with this ID",
      status: 404,
    };
  if (!jobDocument.jobID || jobDocument.jobID !== jobID)
    return {
      error: "Not Found",
      message: "No JobDocument Found with this Job ID",
      status: 404,
    };
  if (!jobDocument.userID || jobDocument.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to delete this jobDocument",
      status: 401,
    };

  const [newJobDocument] = await jobDocumentRepository.deleteJobDocument(
    db,
    id,
    {
      isSoftDelete,
    },
  );
  return { data: formatJobDocumentResponse(newJobDocument) };
}

export default {
  getUserJobDocuments: getUserJobDocumentsService,
  getUserJobDocument: getUserJobDocumentService,
  addJobDocument: addJobDocumentService,
  editJobDocument: editJobDocumentService,
  deleteJobDocument: deleteJobDocumentService,
};
