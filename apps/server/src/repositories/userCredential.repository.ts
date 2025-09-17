import {
  UserCredentialAddPayloadType,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { expiresIn, fromUnixSeconds } from "@hiredtobe/shared/utils";

import { DbType } from "@/server/database";
import models, { userCredentialModel } from "@/server/database/models";

export async function createUserCredential(
  db: DbType,
  payload: UserCredentialAddPayloadType,
) {
  return await db
    .insert(models.userCredential)
    .values({
      userID: payload.userID,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      provider: payload.provider,
      expiry: fromUnixSeconds(expiresIn(payload.expiry)),
    })
    .onConflictDoUpdate({
      target: [userCredentialModel.userID, userCredentialModel.provider],
      set: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiry: fromUnixSeconds(expiresIn(payload.expiry)),
      },
    })
    .returning();
}

export async function findUserCredentialByUserId(
  db: DbType,
  userID: UserEntity["id"],
) {
  return await db.query.userCredentialModel.findMany({
    where: (fields, operators) => operators.eq(fields.userID, userID),
  });
}

export default {
  createUserCredential,
  findUserCredentialByUserId,
};
