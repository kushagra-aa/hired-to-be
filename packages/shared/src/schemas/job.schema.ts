import z from "zod";

import { JobStatusEnum } from "@/shared/types/entities";

export const JobAddFormBaseSchema = {
  title: z.string().min(3).max(255),
  location: z.string().min(3).max(255),
  jdLink: z.url(),
  expectedSalary: z.coerce
    .number<number>()
    .min(0)
    .refine((val) => !isNaN(val), "Required"),
  orgID: z.coerce.number<number>().min(1),
};

export const JobAddFormSchema = z.object({
  ...JobAddFormBaseSchema,
  orgID: z.coerce.number<number>().min(1),
});
export type JobAddFormType = z.infer<typeof JobAddFormSchema>;

export const JobAddFormClientSchema = z
  .object({
    ...JobAddFormBaseSchema,
    orgID: z.coerce.number<number>().min(1).optional(),
    orgName: z.string().min(3).max(255).optional(),
  })
  .refine((data) => data.orgID ?? data.orgName, {
    error: "Either Select or Create an Organization",
    path: ["orgID"],
  });

export type JobAddFormClientType = z.infer<typeof JobAddFormClientSchema>;

export const JobEditFormSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  location: z.string().min(3).max(255).optional(),
  jdLink: z.url().optional(),
  expectedSalary: z.coerce
    .number<number>()
    .min(0)
    .optional()
    .refine((val) => val && !isNaN(val), "Required"),
});

export type JobEditFormType = z.infer<typeof JobEditFormSchema>;

export const JobEditStatusFormSchema = z.object({
  status: z.enum(JobStatusEnum),
});

export type JobEditStatusFormType = z.infer<typeof JobEditStatusFormSchema>;
