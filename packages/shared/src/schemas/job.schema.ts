import z from "zod";

import { JobStatusEnum } from "@/shared/types/entities";

export const JobAddFormSchema = z.object({
  title: z.string().min(3).max(255),
  location: z.string().min(3).max(255),
  jdLink: z.url(),
  expectedSalary: z.number().min(0),
  orgID: z.number().min(1),
});

export type JobAddFormType = z.infer<typeof JobAddFormSchema>;

export const JobEditFormSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  location: z.string().min(3).max(255).optional(),
  jdLink: z.url().optional(),
  expectedSalary: z.number().min(0).optional(),
});

export type JobEditFormType = z.infer<typeof JobEditFormSchema>;

export const JobEditStatusFormSchema = z.object({
  status: z.enum(JobStatusEnum),
});

export type JobEditStatusFormType = z.infer<typeof JobEditStatusFormSchema>;
