import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.model";
import { jobModel } from "./job.model";
import { recruiterModel } from "./recruiter.model";

export const organizationModel = sqliteTable("organizations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  website: text("website"),
  linkedIn: text("linkedin"),
  careersURL: text("careers_url"),
  logoURL: text("logo_url"),

  ...baseFields, // Does not Include `id`
});

export const organizationRelations = relations(
  organizationModel,
  ({ many }) => ({
    jobs: many(jobModel),
    recruiters: many(recruiterModel),
  }),
);
