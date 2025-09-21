import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { eq } from "drizzle-orm";

import { DbType } from "@/server/database";
import { organizationModel } from "@/server/database/models";
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

async function findOrganizationsByUserId(
  db: DbType,
  userID: UserEntity["id"],
  pageSize = 10,
  cursor?: number,
) {
  return await paginate(
    async (cursor, limit) =>
      db.query.organizationModel.findMany({
        where: (fields, operators) =>
          cursor
            ? operators.and(
                operators.eq(fields.userID, userID),
                operators.gt(fields.id, cursor),
              )
            : operators.eq(fields.userID, userID),
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
        limit,
      }),
    pageSize,
    cursor,
  );
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

async function findOrganizationByID(db: DbType, id: OrganizationEntity["id"]) {
  return await db.query.organizationModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });
}

export default {
  addOrganization,
  editOrganization,
  findOrganizationsByUserId,
  findOrganizationByNameAndUserID,
  findOrganizationByID,
};
