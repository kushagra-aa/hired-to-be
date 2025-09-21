import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { recruiterModel } from "./recruiter.model";
import { userModel } from "./user.model";

export const organizationModel = sqliteTable("organizations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  website: text("website"),
  linkedIn: text("linkedin"),
  careersURL: text("careers_url"),
  logoURL: text("logo_url"),

  ...baseFields, // Does not Include `id`
});

export const organizationRelations = relations(
  organizationModel,
  ({ many, one }) => ({
    jobs: many(jobModel),
    recruiters: many(recruiterModel),
    user: one(userModel, {
      fields: [organizationModel.userID],
      references: [userModel.id],
    }),
  }),
);
