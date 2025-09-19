import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";

export const jobDocumentModel = sqliteTable("job_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobID: integer("job_id")
    .notNull()
    .references(() => jobModel.id, { onDelete: "set null" }),
  type: text("type").notNull(),
  url: text("url").notNull(),

  ...baseFields, // Does not Include `id`
});

export const jobDocumentRelations = relations(jobDocumentModel, ({ one }) => ({
  job: one(jobModel, {
    fields: [jobDocumentModel.jobID],
    references: [jobModel.id],
  }),
}));
