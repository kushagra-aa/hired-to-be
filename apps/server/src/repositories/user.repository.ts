import { UserRegisterPayloadType } from "@hiredtobe/shared/entities";
import { eq } from "drizzle-orm";

import { DbType } from "@/server/database";
import models from "@/server/database/models";

export async function createUser(db: DbType, payload: UserRegisterPayloadType) {
  return await db.insert(models.user).values(payload).returning();
}

export async function findUserByGoogleId(db: DbType, googleID: string) {
  return await db
    .select()
    .from(models.user)
    .where(eq(models.user.googleID, googleID))
    .get();
}

export async function findUserByEmail(db: DbType, email: string) {
  return await db
    .select()
    .from(models.user)
    .where(eq(models.user.email, email))
    .get();
}

export default {
  createUser,
  findUserByGoogleId,
  findUserByEmail,
};
