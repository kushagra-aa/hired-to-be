import {
  UserEntity,
  UserRegisterPayloadType,
} from "@hiredtobe/shared/entities";

import { DbType } from "@/server/database";
import models from "@/server/database/models";

export async function createUser(db: DbType, payload: UserRegisterPayloadType) {
  return await db.insert(models.user).values(payload).returning();
}

export async function findUserByGoogleId(
  db: DbType,
  googleID: string,
  relations?: { sessions: boolean; credentials: boolean },
) {
  return await db.query.userModel.findFirst({
    where(fields, operators) {
      return operators.eq(fields.googleID, googleID);
    },
    with:
      relations && relations.sessions && relations.credentials
        ? {
            credentials: relations.credentials,
            sessions: relations.sessions,
          }
        : relations && relations.sessions
          ? { sessions: true }
          : relations && relations.credentials
            ? { credentials: true }
            : undefined,
  });
}

export async function findUserByEmail(
  db: DbType,
  email: string,
  relations?: { sessions: boolean; credentials: boolean },
) {
  return await db.query.userModel.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
    with:
      relations && relations.sessions && relations.credentials
        ? {
            credentials: relations.credentials,
            sessions: relations.sessions,
          }
        : relations && relations.sessions
          ? { sessions: true }
          : relations && relations.credentials
            ? { credentials: true }
            : undefined,
  });
}

export async function findActiveUserById(db: DbType, id: UserEntity["id"]) {
  return await db.query.userModel.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id) && operators.eq(fields.isActive, true);
    },
  });
}

export default {
  createUser,
  findUserByGoogleId,
  findUserByEmail,
  findActiveUserById,
};
