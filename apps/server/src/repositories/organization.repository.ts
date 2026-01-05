import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { and, eq, sql } from "drizzle-orm";

import { DbType } from "@/server/database";
import { organizationModel } from "@/server/database/models";
import { GetOrganizationExtendType } from "@/server/services/organization.service";
import { paginate } from "@/server/utils/helpers";

async function addOrganization(db: DbType, org: OrganizationAddPayloadType) {
  return await db.insert(organizationModel).values(org).returning();
}

async function editOrganization(
  db: DbType,
  id: OrganizationEntity["id"],
  org: OrganizationEditPayloadType,
) {
  return await db
    .update(organizationModel)
    .set(org)
    .where(eq(organizationModel.id, id))
    .returning();
}

async function getTotalOrganizationsByUserId(
  db: DbType,
  userID: UserEntity["id"],
) {
  return await db
    .select({ count: sql<number>`count(*)` })
    .from(organizationModel)
    .where(
      and(
        eq(organizationModel.userID, userID),
        eq(organizationModel.isActive, true),
      ),
    );
}
async function findOrganizationsByUserId(
  db: DbType,
  userID: UserEntity["id"],
  pageSize = 10,
  cursor?: number,
  extend?: GetOrganizationExtendType,
) {
  return await paginate(
    async (cursor, limit) =>
      db.query.organizationModel.findMany({
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
              jobs: extend.includes("jobs") ? true : undefined,
              recruiters: extend.includes("recruiters") ? true : undefined,
            }
          : undefined,
      }),
    pageSize,
    cursor,
  );
}
async function getOrganizationsWithFields(
  db: DbType,
  userID: UserEntity["id"],
) {
  return await await db
    .select({
      value: sql<string>`CAST(${organizationModel.id} AS TEXT)`,
      label: organizationModel.name,
    })
    .from(organizationModel)
    .where(
      and(
        eq(organizationModel.userID, userID),
        eq(organizationModel.isActive, true),
      ),
    );
}

async function getOrganizationByUserID(
  db: DbType,
  id: OrganizationEntity["id"],
  userID: UserEntity["id"],
  extend?: GetOrganizationExtendType,
) {
  return await db.query.organizationModel.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.userID, userID),
        operators.eq(fields.id, id),
      ),
    with: extend
      ? {
          jobs: extend.includes("jobs") ? true : undefined,
          recruiters: extend.includes("recruiters") ? true : undefined,
        }
      : undefined,
  });
}
async function findOrganizationByNameAndUserID(
  db: DbType,
  name: string,
  userID: UserEntity["id"],
) {
  return await db.query.organizationModel.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.userID, userID),
        operators.eq(fields.name, name),
      ),
  });
}

async function findOrganizationByID(
  db: DbType,
  id: OrganizationEntity["id"],
  extend?: GetOrganizationExtendType,
) {
  return await db.query.organizationModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: extend
      ? {
          jobs: extend.includes("jobs") ? true : undefined,
          recruiters: extend.includes("recruiters") ? true : undefined,
        }
      : undefined,
  });
}

async function deleteOrganization(
  db: DbType,
  id: OrganizationEntity["id"],
  config?: { isSoftDelete?: boolean },
) {
  if (config && config.isSoftDelete) {
    return await db
      .update(organizationModel)
      .set({ isActive: false })
      .where(eq(organizationModel.id, id))
      .returning();
  }
  return await db
    .delete(organizationModel)
    .where(eq(organizationModel.id, id))
    .returning();
}

export default {
  addOrganization,
  editOrganization,
  getOrganizationsWithFields,
  getOrganizationByUserID,
  findOrganizationsByUserId,
  getTotalOrganizationsByUserId,
  findOrganizationByNameAndUserID,
  findOrganizationByID,
  deleteOrganization,
};
