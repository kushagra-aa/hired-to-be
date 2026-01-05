import {
  OrganizationAddPayloadType,
  OrganizationEditPayloadType,
  OrganizationEntity,
  OrganizationOptionType,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import organizationRepository from "@/server/repositories/organization.repository";

export type GetOrganizationExtendType = false | ("jobs" | "recruiters")[];

async function getUserOrganizationsService(
  db: DbType,
  userID: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
  extend?: GetOrganizationExtendType,
): ServiceReturnType<OrganizationEntity[]> {
  const organizations = await organizationRepository.findOrganizationsByUserId(
    db,
    userID,
    pageSize,
    cursor,
    extend,
  );
  const [total] = await organizationRepository.getTotalOrganizationsByUserId(
    db,
    userID,
  );

  return {
    data: organizations.data,
    cursorPagination: {
      pageSize: pageSize || 10,
      hasMore: organizations.hasMore,
      count: organizations.data.length,
      nextCursor: organizations.nextCursor,
      total: total.count,
    },
  };
}
async function getUserOrganizationByIDService(
  db: DbType,
  id: OrganizationEntity["id"],
  userID: UserEntity["id"],
  extend?: GetOrganizationExtendType,
): ServiceReturnType<OrganizationEntity> {
  const organization = await organizationRepository.getOrganizationByUserID(
    db,
    id,
    userID,
    extend,
  );
  if (!organization)
    return {
      error: "Not Found",
      message: "No Organization Found with this ID",
      status: 404,
    };

  return {
    data: organization,
  };
}
async function getUserOrganizationsAsOptionsService(
  db: DbType,
  userID: UserEntity["id"],
): ServiceReturnType<OrganizationOptionType[]> {
  const organizations = await organizationRepository.getOrganizationsWithFields(
    db,
    userID,
  );
  return {
    data: organizations,
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
  userID: UserEntity["id"],
): ServiceReturnType<OrganizationEntity> {
  const org = await organizationRepository.findOrganizationByID(db, id);
  if (!org)
    return {
      error: "Not Found",
      message: "No Organization Found with this ID",
      status: 404,
    };
  if (payload.name && org.name !== payload.name) {
    const exisiting =
      await organizationRepository.findOrganizationByNameAndUserID(
        db,
        payload.name,
        userID,
      );
    if (exisiting)
      return {
        error: "Conflict",
        errors: { name: ["Organization with this name already exists"] },
        message: "Organization with this name already exists",
        status: 409,
      };
  }
  const [newOrg] = await organizationRepository.editOrganization(
    db,
    id,
    payload,
  );
  return { data: newOrg };
}

async function deleteOrganizationService(
  db: DbType,
  id: OrganizationEntity["id"],
  userID: UserEntity["id"],
  isSoftDelete = true,
): ServiceReturnType<OrganizationEntity> {
  const org = await organizationRepository.findOrganizationByID(db, id);
  if (!org)
    return {
      error: "Not Found",
      message: "No Organization Found with this ID",
      status: 404,
    };
  const exisiting =
    await organizationRepository.findOrganizationByNameAndUserID(
      db,
      org.name,
      userID,
    );
  if (!exisiting)
    return {
      error: "UnAuthorized",
      message: "You are not authorized to delete this organization",
      status: 401,
    };

  const [newOrg] = await organizationRepository.deleteOrganization(db, id, {
    isSoftDelete,
  });
  return { data: newOrg };
}

export default {
  getUserOrganizations: getUserOrganizationsService,
  getUserOrganizationByID: getUserOrganizationByIDService,
  getUserOrganizationsAsOptions: getUserOrganizationsAsOptionsService,
  addOrganization: addOrganizationService,
  editOrganization: editOrganizationService,
  deleteOrganization: deleteOrganizationService,
};
