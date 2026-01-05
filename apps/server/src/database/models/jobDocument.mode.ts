import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { userModel } from "./user.model";

export const jobDocumentModel = sqliteTable("job_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userID: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "cascade" }),
  jobID: integer("job_id")
    .notNull()
    .references(() => jobModel.id, { onDelete: "set null" }),
  type: text("type").notNull(),
  url: text("url").notNull(),

  ...baseFields, // Does not Include `id`
});

export type JobDocumentModelType = InferSelectModel<typeof jobDocumentModel>;

export const jobDocumentRelations = relations(jobDocumentModel, ({ one }) => ({
  user: one(userModel, {
    fields: [jobDocumentModel.userID],
    references: [userModel.id],
  }),
  job: one(jobModel, {
    fields: [jobDocumentModel.jobID],
    references: [jobModel.id],
  }),
}));
