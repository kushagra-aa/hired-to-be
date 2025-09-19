import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { organizationModel } from "./organization.model";

export const recruiterModel = sqliteTable("recruiters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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

export const recruiterRelations = relations(recruiterModel, ({ one }) => ({
  job: one(jobModel, {
    fields: [recruiterModel.jobID],
    references: [jobModel.id],
  }),
  organization: one(organizationModel, {
    fields: [recruiterModel.orgID],
    references: [organizationModel.id],
  }),
}));
