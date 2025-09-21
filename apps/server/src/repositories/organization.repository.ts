import { UserEntity } from "@hiredtobe/shared/entities";

import { DbType } from "@/server/database";
import { paginate } from "@/server/utils/helpers";

export async function findOrganizationsByUserId(
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
        orderBy: (fields, { asc }) => [asc(fields.id)],
        limit,
      }),
    pageSize,
    cursor,
  );
}

export default {
  findOrganizationsByUserId,
};
