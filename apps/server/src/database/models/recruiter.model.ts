import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { organizationModel } from "./organization.model";
import { userModel } from "./user.model";

export const recruiterModel = sqliteTable("recruiters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "set null" }),
  jobID: integer("job_id")
    .notNull()
    .references(() => jobModel.id, { onDelete: "set null" }),
  orgID: integer("org_id")
    .notNull()
    .references(() => organizationModel.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  linkedIn: text("linkedin"),

  ...baseFields, // Does not Include `id`
});
export type RecruiterModelType = InferSelectModel<typeof recruiterModel>;

export const recruiterRelations = relations(recruiterModel, ({ one }) => ({
  user: one(userModel, {
    fields: [recruiterModel.userID],
    references: [userModel.id],
  }),
  job: one(jobModel, {
    fields: [recruiterModel.jobID],
    references: [jobModel.id],
  }),
  organization: one(organizationModel, {
    fields: [recruiterModel.orgID],
    references: [organizationModel.id],
  }),
}));
