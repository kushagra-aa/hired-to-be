import { UserRoleEnum } from "@shared/types/entities/user.entity.js";
import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model.js";

export const userModel = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    googleID: text("google_id").notNull().unique(),
    email: text("email").notNull().unique(),
    fullName: text("full_name", { length: 255 }),
    role: text("role")
      .notNull()
      .$defaultFn(() => UserRoleEnum.user),

    ...baseFields,
  },
  (t) => [
    uniqueIndex("user_email_idx").on(t.email),
    uniqueIndex("user_google_idx").on(t.googleID),
  ],
);

export type UserModelType = InferSelectModel<typeof userModel>;
