import {
  JobAddPayloadType,
  JobEditPayloadType,
  JobEntity,
  JobStatusEnum,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import jobRepository from "@/server/repositories/job.repository";

import { JobModelType } from "../database/models";
import organizationRepository from "../repositories/organization.repository";

export type GetJobExtendType =
  | false
  | ("user" | "organization" | "recruiters" | "interviews" | "documents")[];

const formatJobResponse = (job: JobModelType): JobEntity => ({
  ...job,
  status: job.status as JobStatusEnum,
});
const formatJobsResponse = (jobs: JobModelType[]): JobEntity[] =>
  jobs.map((job) => formatJobResponse(job));

async function getUserJobsService(
  db: DbType,
  userID: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
  extend?: GetJobExtendType,
): ServiceReturnType<JobEntity[]> {
  const jobs = await jobRepository.findJobsByUserId(
    db,
    userID,
    pageSize,
    cursor,
    extend,
  );
  const [total] = await jobRepository.getTotalJobsByUserId(db, userID);

  return {
    data: formatJobsResponse(jobs.data),
    cursorPagination: {
      pageSize: pageSize || 10,
      hasMore: jobs.hasMore,
      count: jobs.data.length,
      nextCursor: jobs.nextCursor,
      total: total.count,
    },
  };
}

async function getUserJobService(
  db: DbType,
  userID: UserEntity["id"],
  jobID: JobEntity["id"],
  extend?: GetJobExtendType,
): ServiceReturnType<JobEntity> {
  const job = await jobRepository.findJobByUserId(db, userID, jobID, extend);
  if (!job)
    return {
      error: "Not Found",
      message: "No Job Found with this ID",
      status: 404,
    };

  return {
    data: formatJobResponse(job),
  };
}

async function addJobService(
  db: DbType,
  payload: JobAddPayloadType,
): ServiceReturnType<JobEntity> {
  const org = await organizationRepository.findOrganizationByID(
    db,
    payload.orgID,
  );
  if (!org)
    return {
      error: "Not Found",
      message: "No Organization Found with this ID",
      errors: { orgID: ["Organization with this ID does not exist"] },
      status: 404,
    };
  if (org.userID !== payload.userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to access this organization",
      status: 401,
    };

  const [newJob] = await jobRepository.addJob(db, payload);
  return { data: formatJobResponse(newJob) };
}

async function editJobService(
  db: DbType,
  id: JobEntity["id"],
  payload: JobEditPayloadType,
  userID: UserEntity["id"],
): ServiceReturnType<JobEntity> {
  const job = await jobRepository.findJobByID(db, id);
  if (!job)
    return {
      error: "Not Found",
      message: "No Job Found with this ID",
      status: 404,
    };
  if (!job.userID || job.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to edit this job",
      status: 401,
    };

  const [newJob] = await jobRepository.editJob(db, id, payload);
  return { data: formatJobResponse(newJob) };
}

async function deleteJobService(
  db: DbType,
  id: JobEntity["id"],
  userID: UserEntity["id"],
  isSoftDelete = true,
): ServiceReturnType<JobEntity> {
  const job = await jobRepository.findJobByID(db, id);
  if (!job)
    return {
      error: "Not Found",
      message: "No Job Found with this ID",
      status: 404,
    };

  if (!job.userID || job.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to delete this job",
      status: 401,
    };

  const [newJob] = await jobRepository.deleteJob(db, id, {
    isSoftDelete,
  });
  return { data: formatJobResponse(newJob) };
}

export default {
  getUserJobs: getUserJobsService,
  getUserJob: getUserJobService,
  addJob: addJobService,
  editJob: editJobService,
  deleteJob: deleteJobService,
};
