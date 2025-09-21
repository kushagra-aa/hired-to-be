import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import organizationRepository from "@/server/repositories/organization.repository";

async function getUserOrganizationsService(
  db: DbType,
  userID: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
): ServiceReturnType<OrganizationEntity[]> {
  const organizations = await organizationRepository.findOrganizationsByUserId(
    db,
    userID,
    pageSize,
    cursor,
  );
  return {
    data: organizations.data,
    cursorPagination: {
      pageSize: pageSize || 10,
      hasMore: organizations.hasMore,
      count: organizations.data.length,
      nextCursor: organizations.nextCursor,
    },
  };
}

async function addOrganizationService(
  db: DbType,
  payload: OrganizationAddPayloadType,
): ServiceReturnType<OrganizationEntity> {
  const exisiting =
    await organizationRepository.findOrganizationByNameAndUserID(
      db,
      payload.name,
      payload.userID,
    );
  if (exisiting)
    return {
      error: "Conflict",
      errors: { name: ["Organization with this name already exists"] },
      message: "Organization with this name already exists",
      status: 409,
    };
  const [newOrg] = await organizationRepository.addOrganization(db, payload);
  return { data: newOrg };
}

async function editOrganizationService(
  db: DbType,
  id: OrganizationEntity["id"],
  payload: OrganizationEditPayloadType,
): ServiceReturnType<OrganizationEntity> {
  const exisiting = await organizationRepository.findOrganizationByID(db, id);
  if (!exisiting)
    return {
      error: "Not Found",
      message: "No Organization Found with this ID",
      status: 404,
    };
  const [newOrg] = await organizationRepository.editOrganization(
    db,
    id,
    payload,
  );
  return { data: newOrg };
}

export default {
  getUserOrganizations: getUserOrganizationsService,
  addOrganization: addOrganizationService,
  editOrganization: editOrganizationService,
};
