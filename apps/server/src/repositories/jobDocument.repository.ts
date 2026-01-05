import {
  JobDocumentAddPayloadType,
  JobDocumentEditPayloadType,
  JobDocumentEntity,
  JobEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { and, eq, sql } from "drizzle-orm";

import { DbType } from "@/server/database";
import { jobDocumentModel } from "@/server/database/models";
import { paginate } from "@/server/utils/helpers";

async function addJobDocument(
  db: DbType,
  payload: JobDocumentAddPayloadType & {
    userID: UserEntity["id"];
    jobID: JobEntity["id"];
  },
) {
  return await db.insert(jobDocumentModel).values(payload).returning();
}

async function editJobDocument(
  db: DbType,
  id: JobDocumentEntity["id"],
  payload: JobDocumentEditPayloadType,
) {
  return await db
    .update(jobDocumentModel)
    .set(payload)
    .where(eq(jobDocumentModel.id, id))
    .returning();
}

async function getTotalJobDocumentsByUserId(
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
) {
  return await db
    .select({ count: sql<number>`count(*)` })
    .from(jobDocumentModel)
    .where(
      and(
        eq(jobDocumentModel.jobID, jobID),
        eq(jobDocumentModel.userID, userID),
        eq(jobDocumentModel.isActive, true),
      ),
    );
}

async function findJobDocumentsByUserId(
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
  pageSize = 10,
  cursor?: number,
) {
  return await paginate(
    async (cursor, limit) =>
      db.query.jobDocumentModel.findMany({
        where: (fields, operators) =>
          cursor
            ? operators.and(
                operators.eq(fields.jobID, jobID),
                operators.eq(fields.userID, userID),
                operators.gt(fields.id, cursor),
                operators.eq(fields.isActive, true),
              )
            : operators.and(
                operators.eq(fields.jobID, jobID),
                operators.eq(fields.userID, userID),
                operators.eq(fields.isActive, true),
              ),
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
        limit,
      }),
    pageSize,
    cursor,
  );
}

async function findJobDocumentByUserId(
  db: DbType,
  jobID: JobEntity["id"],
  userID: UserEntity["id"],
  jobDocumentID: JobDocumentEntity["id"],
) {
  const job = await db.query.jobDocumentModel.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(jobDocumentModel.jobID, jobID),
        operators.eq(fields.id, jobDocumentID),
        operators.eq(fields.userID, userID),
      ),
  });
  return job;
}

async function findJobDocumentByID(db: DbType, id: JobDocumentEntity["id"]) {
  return await db.query.jobDocumentModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });
}

async function deleteJobDocument(
  db: DbType,
  id: JobDocumentEntity["id"],
  config?: { isSoftDelete?: boolean },
) {
  if (config && config.isSoftDelete) {
    return await db
      .update(jobDocumentModel)
      .set({ isActive: false })
      .where(eq(jobDocumentModel.id, id))
      .returning();
  }
  return await db
    .delete(jobDocumentModel)
    .where(eq(jobDocumentModel.id, id))
    .returning();
}

export default {
  addJobDocument,
  editJobDocument,
  findJobDocumentsByUserId,
  getTotalJobDocumentsByUserId,
  findJobDocumentByID,
  deleteJobDocument,
  findJobDocumentByUserId,
};
