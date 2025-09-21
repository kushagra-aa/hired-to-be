import { OrganizationEntity, UserEntity } from "@hiredtobe/shared/entities";
import { ServiceReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import organizationRepository from "@/server/repositories/organization.repository";

export async function getUserOrganizationsService(
  db: DbType,
  userId: UserEntity["id"],
  pageSize?: number,
  cursor?: number,
): ServiceReturnType<OrganizationEntity[]> {
  const organizations = await organizationRepository.findOrganizationsByUserId(
    db,
    userId,
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

export default { getUserOrganizations: getUserOrganizationsService };
