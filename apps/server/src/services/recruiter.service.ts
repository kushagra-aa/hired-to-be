import {
  JobEntity,
  RecruiterAddPayloadType,
  RecruiterEditPayloadType,
  RecruiterEntity,
  RecruiterResponseType,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import { RecruiterModelType } from "@/server/database/models";
import recruiterRepository from "@/server/repositories/recruiter.repository";

import jobRepository from "../repositories/job.repository";

export type GetRecruiterExtendType =
  | false
  | ("organization" | "job" | "user")[];

const formatRecruiterResponse = (
  recruiter: RecruiterModelType,
): RecruiterResponseType => ({
  ...recruiter,
});
const formatRecruitersResponse = (
  recruiters: RecruiterModelType[],
): RecruiterResponseType[] =>
  recruiters.map((recruiter) => formatRecruiterResponse(recruiter));

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

async function getUserRecruitersService(
  db: DbType,
  userID: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
  extend?: GetRecruiterExtendType,
): ServiceReturnType<RecruiterEntity[]> {
  const recruiters = await recruiterRepository.findRecruitersByUserId(
    db,
    userID,
    pageSize,
    cursor,
    extend,
  );
  const [total] = await recruiterRepository.getTotalRecruitersByUserId(
    db,
    userID,
  );

  return {
    data: formatRecruitersResponse(recruiters.data),
    cursorPagination: {
      pageSize: pageSize || 10,
      hasMore: recruiters.hasMore,
      count: recruiters.data.length,
      nextCursor: recruiters.nextCursor,
      total: total.count,
    },
  };
}

async function getUserRecruiterService(
  db: DbType,
  userID: UserEntity["id"],
  recruiterID: RecruiterEntity["id"],
  extend?: GetRecruiterExtendType,
): ServiceReturnType<RecruiterEntity> {
  const recruiter = await recruiterRepository.findRecruiterByUserId(
    db,
    userID,
    recruiterID,
    extend,
  );
  if (!recruiter)
    return {
      error: "Not Found",
      message: "No Recruiter Found with this ID",
      status: 404,
    };

  return {
    data: formatRecruiterResponse(recruiter),
  };
}

async function addRecruiterService(
  db: DbType,
  payload: RecruiterAddPayloadType,
  userID: UserEntity["id"],
): ServiceReturnType<RecruiterEntity> {
  const job = await checkJob(db, payload.jobID, userID);
  if (job?.error || !job.data) return job;
  const [newRecruiter] = await recruiterRepository.addRecruiter(db, {
    ...payload,
    orgID: job.data.orgID,
    userID,
  });
  return { data: formatRecruiterResponse(newRecruiter) };
}

async function editRecruiterService(
  db: DbType,
  id: RecruiterEntity["id"],
  payload: RecruiterEditPayloadType,
  userID: UserEntity["id"],
): ServiceReturnType<RecruiterEntity> {
  const recruiter = await recruiterRepository.findRecruiterByID(db, id);
  if (!recruiter)
    return {
      error: "Not Found",
      message: "No Recruiter Found with this ID",
      status: 404,
    };
  if (!recruiter.userID || recruiter.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to edit this recruiter",
      status: 401,
    };
  if (payload.jobID) {
    const job = await checkJob(db, payload.jobID, userID);
    if (job?.error || !job.data) return job;
  }

  const [newRecruiter] = await recruiterRepository.editRecruiter(
    db,
    id,
    payload,
  );
  return { data: formatRecruiterResponse(newRecruiter) };
}

async function deleteRecruiterService(
  db: DbType,
  id: RecruiterEntity["id"],
  userID: UserEntity["id"],
  isSoftDelete = true,
): ServiceReturnType<RecruiterEntity> {
  const recruiter = await recruiterRepository.findRecruiterByID(db, id);
  if (!recruiter)
    return {
      error: "Not Found",
      message: "No Recruiter Found with this ID",
      status: 404,
    };

  if (!recruiter.userID || recruiter.userID !== userID)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to delete this recruiter",
      status: 401,
    };

  const [newRecruiter] = await recruiterRepository.deleteRecruiter(db, id, {
    isSoftDelete,
  });
  return { data: formatRecruiterResponse(newRecruiter) };
}

export default {
  getUserRecruiters: getUserRecruitersService,
  getUserRecruiter: getUserRecruiterService,
  addRecruiter: addRecruiterService,
  editRecruiter: editRecruiterService,
  deleteRecruiter: deleteRecruiterService,
};
