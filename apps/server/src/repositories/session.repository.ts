import {
  SessionAddPayloadType,
  SessionEntity,
  UserEntity,
} from "@hiredtobe/shared/entities";
import { expiresIn, fromUnixSeconds } from "@hiredtobe/shared/utils";
import { eq } from "drizzle-orm";

import { DbType } from "@/server/database";
import models, { sessionModel } from "@/server/database/models";

export async function createSession(
  db: DbType,
  payload: SessionAddPayloadType,
) {
  return await db
    .insert(models.session)
    .values({
      userID: payload.userID,
      expiresAt: fromUnixSeconds(expiresIn(payload.expiresAt)),
    })
    .returning();
}

export async function findSessionsByUserID(
  db: DbType,
  userID: UserEntity["id"],
) {
  return await db.query.sessionModel.findMany({
    where: (fields, operators) => operators.eq(fields.userID, userID),
  });
}

export async function findSessionBySesssionId(
  db: DbType,
  sessionID: SessionEntity["id"],
) {
  return await db.query.sessionModel.findFirst({
    where: (fields, operators) => operators.eq(fields.id, sessionID),
  });
}

export async function findSessionByActiveSesssionId(
  db: DbType,
  sessionID: SessionEntity["id"],
) {
  return await db.query.sessionModel.findFirst({
    where: (fields, operators) =>
      operators.eq(fields.id, sessionID) &&
      operators.gt(fields.expiresAt, new Date()),
  });
}

export async function deleteSessionBySesssionID(
  db: DbType,
  sessionID: SessionEntity["id"],
) {
  return await db.delete(sessionModel).where(eq(sessionModel.id, sessionID));
}

export async function deleteSessionsByUserID(
  db: DbType,
  userID: SessionEntity["id"],
) {
  return await db.delete(sessionModel).where(eq(sessionModel.userID, userID));
}

export default {
  createSession,
  findSessionsByUserID,
  findSessionBySesssionId,
  findSessionByActiveSesssionId,
  deleteSessionBySesssionID,
  deleteSessionsByUserID,
};
