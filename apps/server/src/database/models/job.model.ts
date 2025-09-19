import { JobStatusEnum } from "@hiredtobe/shared/entities";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobDocumentModel } from "./jobDocument.mode";
import { organizationModel } from "./organization.model";
import { recruiterModel } from "./recruiter.model";
import { userModel } from "./user.model";

export const jobModel = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "cascade" }),
  orgID: integer("org_id")
    .notNull()
    .references(() => organizationModel.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  location: text("location").notNull(),
  jdLink: text("jd_link").notNull(),
  expectedSalary: integer("expected_salary").notNull(),
  offeredSalary: integer("offered_salary").notNull(),
  status: text("status")
    .notNull()
    .$defaultFn(() => JobStatusEnum.applied),

  ...baseFields, // Does not Include `id`
});

export const jobRelations = relations(jobModel, ({ one, many }) => ({
  user: one(userModel, {
    fields: [jobModel.userID],
    references: [userModel.id],
  }),
  organization: one(organizationModel, {
    fields: [jobModel.orgID],
    references: [organizationModel.id],
  }),
  recruiters: many(recruiterModel),
  documents: many(jobDocumentModel),
}));
