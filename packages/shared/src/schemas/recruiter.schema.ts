import z from "zod";

import { phoneRegex } from "../constants";

export const RecruiterAddFormSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.email().optional(),
  phone: z.string().regex(phoneRegex).optional(),
  linkedIn: z.url().optional(),
  jobID: z.number().min(1),
});

export type RecruiterAddFormType = z.infer<typeof RecruiterAddFormSchema>;

export const RecruiterEditFormSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.email().optional(),
  phone: z.string().regex(phoneRegex).optional(),
  linkedIn: z.url().optional(),
  jobID: z.number().min(1).optional(),
});

export type RecruiterEditFormType = z.infer<typeof RecruiterEditFormSchema>;
