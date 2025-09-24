import {
  JobAddPayloadType,
  JobEditPayloadType,
  JobEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { and, eq, sql } from "drizzle-orm";

import { DbType } from "@/server/database";
import { jobModel } from "@/server/database/models";
import { paginate } from "@/server/utils/helpers";

import { GetJobExtendType } from "../services/job.service";

async function addJob(db: DbType, org: JobAddPayloadType) {
  return await db.insert(jobModel).values(org).returning();
}

async function editJob(
  db: DbType,
  id: JobEntity["id"],
  org: JobEditPayloadType,
) {
  return await db
    .update(jobModel)
    .set(org)
    .where(eq(jobModel.id, id))
    .returning();
}

async function getTotalJobsByUserId(db: DbType, userID: UserEntity["id"]) {
  return await db
    .select({ count: sql<number>`count(*)` })
    .from(jobModel)
    .where(and(eq(jobModel.userID, userID), eq(jobModel.isActive, true)));
}

async function findJobsByUserId(
  db: DbType,
  userID: UserEntity["id"],
  pageSize = 10,
  cursor?: number,
  extend?: GetJobExtendType,
) {
  return await paginate(
    async (cursor, limit) =>
      db.query.jobModel.findMany({
        where: (fields, operators) =>
          cursor
            ? operators.and(
                operators.eq(fields.userID, userID),
                operators.gt(fields.id, cursor),
                operators.eq(fields.isActive, true),
              )
            : operators.and(
                operators.eq(fields.userID, userID),
                operators.eq(fields.isActive, true),
              ),
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
        limit,
        with: extend
          ? {
              user: extend.includes("user") ? true : undefined,
              organization: extend.includes("organization") ? true : undefined,
              recruiters: extend.includes("recruiters") ? true : undefined,
              documents: extend.includes("documents") ? true : undefined,
            }
          : undefined,
      }),
    pageSize,
    cursor,
  );
}

async function findJobByUserId(
  db: DbType,
  userID: UserEntity["id"],
  jobID: JobEntity["id"],
  extend?: GetJobExtendType,
) {
  return await db.query.jobModel.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.id, jobID),
        operators.eq(fields.userID, userID),
      ),
    with: extend
      ? {
          user: extend.includes("user") ? true : undefined,
          organization: extend.includes("organization") ? true : undefined,
          recruiters: extend.includes("recruiters") ? true : undefined,
          documents: extend.includes("documents") ? true : undefined,
        }
      : undefined,
  });
}

async function findJobByID(db: DbType, id: JobEntity["id"]) {
  return await db.query.jobModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });
}

async function deleteJob(
  db: DbType,
  id: JobEntity["id"],
  config?: { isSoftDelete?: boolean },
) {
  if (config && config.isSoftDelete) {
    return await db
      .update(jobModel)
      .set({ isActive: false })
      .where(eq(jobModel.id, id))
      .returning();
  }
  return await db.delete(jobModel).where(eq(jobModel.id, id)).returning();
}

export default {
  addJob,
  editJob,
  findJobsByUserId,
  getTotalJobsByUserId,
  findJobByID,
  deleteJob,
  findJobByUserId,
};
