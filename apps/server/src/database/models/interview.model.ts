import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { organizationModel } from "./organization.model";
import { userModel } from "./user.model";

export const interviewModel = sqliteTable("interviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "cascade" }),
  orgID: integer("org_id")
    .notNull()
    .references(() => organizationModel.id, { onDelete: "cascade" }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobModel.id, { onDelete: "cascade" }),
  dateTime: integer("date_time", { mode: "timestamp" }),
  roundType: text("round_type").notNull(),
  meetingLink: text("meeting_link").notNull(),
  notes: text("notes", { mode: "text" }),
  feedback: text("feedback", { mode: "text" }),
  rating: integer("rating", { mode: "number" }).notNull(),
  calendarEventId: text("calander_event_id", { mode: "text" }),
  ...baseFields, // Does not Include `id`
});

export type JobModelType = InferSelectModel<typeof interviewModel>;

export const interviewRelations = relations(interviewModel, ({ one }) => ({
  user: one(userModel, {
    fields: [interviewModel.userID],
    references: [userModel.id],
  }),
  organization: one(organizationModel, {
    fields: [interviewModel.orgID],
    references: [organizationModel.id],
  }),
  job: one(jobModel, {
    fields: [interviewModel.orgID],
    references: [jobModel.id],
  }),
}));
