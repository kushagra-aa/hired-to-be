import {
  OrganizationEntity,
  RecruiterAddPayloadType,
  RecruiterEditPayloadType,
  RecruiterEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { and, eq, sql } from "drizzle-orm";

import { DbType } from "@/server/database";
import { recruiterModel } from "@/server/database/models";
import { GetRecruiterExtendType } from "@/server/services/recruiter.service";
import { paginate } from "@/server/utils/helpers";

async function addRecruiter(
  db: DbType,
  payload: RecruiterAddPayloadType & {
    userID: UserEntity["id"];
    orgID: OrganizationEntity["id"];
  },
) {
  return await db.insert(recruiterModel).values(payload).returning();
}

async function editRecruiter(
  db: DbType,
  id: RecruiterEntity["id"],
  payload: RecruiterEditPayloadType,
) {
  return await db
    .update(recruiterModel)
    .set(payload)
    .where(eq(recruiterModel.id, id))
    .returning();
}

async function getTotalRecruitersByUserId(
  db: DbType,
  userID: UserEntity["id"],
) {
  return await db
    .select({ count: sql<number>`count(*)` })
    .from(recruiterModel)
    .where(
      and(eq(recruiterModel.userID, userID), eq(recruiterModel.isActive, true)),
    );
}

async function findRecruitersByUserId(
  db: DbType,
  userID: UserEntity["id"],
  pageSize = 10,
  cursor?: number,
  extend?: GetRecruiterExtendType,
) {
  return await paginate(
    async (cursor, limit) =>
      db.query.recruiterModel.findMany({
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
              organization: extend.includes("organization") ? true : undefined,
              job: extend.includes("job") ? true : undefined,
              user: extend.includes("user") ? true : undefined,
            }
          : undefined,
      }),
    pageSize,
    cursor,
  );
}

async function findRecruiterByUserId(
  db: DbType,
  userID: UserEntity["id"],
  recruiterID: RecruiterEntity["id"],
  extend?: GetRecruiterExtendType,
) {
  const job = await db.query.recruiterModel.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.id, recruiterID),
        operators.eq(fields.userID, userID),
      ),
    with: extend
      ? {
          organization: extend.includes("organization") ? true : undefined,
          job: extend.includes("job") ? true : undefined,
          user: extend.includes("user") ? true : undefined,
        }
      : undefined,
  });
  return job;
}

async function findRecruiterByID(
  db: DbType,
  id: RecruiterEntity["id"],
  extend?: { job: false | { user: boolean }; organization: boolean },
) {
  return await db.query.recruiterModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: extend
      ? {
          organization: extend.organization ? true : undefined,
          job: extend.job
            ? { with: { user: extend.job.user ? true : undefined } }
            : undefined,
        }
      : undefined,
  });
}

async function deleteRecruiter(
  db: DbType,
  id: RecruiterEntity["id"],
  config?: { isSoftDelete?: boolean },
) {
  if (config && config.isSoftDelete) {
    return await db
      .update(recruiterModel)
      .set({ isActive: false })
      .where(eq(recruiterModel.id, id))
      .returning();
  }
  return await db
    .delete(recruiterModel)
    .where(eq(recruiterModel.id, id))
    .returning();
}

export default {
  addRecruiter,
  editRecruiter,
  findRecruitersByUserId,
  getTotalRecruitersByUserId,
  findRecruiterByID,
  deleteRecruiter,
  findRecruiterByUserId,
};
