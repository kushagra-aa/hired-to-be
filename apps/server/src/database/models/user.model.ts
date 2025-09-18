import { UserRoleEnum } from "@hiredtobe/shared/entities";
import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";

export const userModel = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    googleID: text("google_id").notNull().unique(),
    email: text("email").notNull().unique(),
    fullName: text("full_name", { length: 255 }),
    image: text("image").default(""),
    role: text("role")
      .notNull()
      .$defaultFn(() => UserRoleEnum.user),

    ...baseFields, // Does not Include `id`
  },
  (t) => [
    uniqueIndex("user_email_idx").on(t.email),
    uniqueIndex("user_google_idx").on(t.googleID),
  ],
);
export type UserModelType = InferSelectModel<typeof userModel>;

// User → Sessions (1:N)
export const userRelations = relations(userModel, ({ many }) => ({
  sessions: many(sessionModel),
  credentials: many(userCredentialModel),
}));

export const userCredentialModel = sqliteTable(
  "user_credentials",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userID: integer("user_id")
      .notNull()
      .references(() => userModel.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    provider: text("provider").notNull(),
    scopes: text("scopes", { mode: "json" }).notNull().default("[]"),
    expiry: integer("expiry", { mode: "timestamp" }).notNull(),

    ...baseFields, // Does not Include `id`
  },
  (t) => ({
    userProviderIdx: uniqueIndex("user_provider_idx").on(t.userID, t.provider),
  }),
);

// UserCredential → User (N:1)
export const userCredentialRelations = relations(
  userCredentialModel,
  ({ one }) => ({
    user: one(userModel, {
      fields: [userCredentialModel.userID],
      references: [userModel.id],
    }),
  }),
);

export const sessionModel = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),

  ...baseFields, // Does not Include `id`
});

// Session → User (N:1)
export const sessionRelations = relations(sessionModel, ({ one }) => ({
  user: one(userModel, {
    fields: [sessionModel.userID],
    references: [userModel.id],
  }),
}));
