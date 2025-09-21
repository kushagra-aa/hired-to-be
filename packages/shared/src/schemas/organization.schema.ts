import z from "zod";

export const OrganizationAddFormSchema = z.object({
  name: z.string().min(3).max(255),
  website: z.url().optional(),
  linkedIn: z.url().optional(),
  careersURL: z.url().optional(),
  logoURL: z.url().optional(),
});

export type OrganizationAddFormType = z.infer<typeof OrganizationAddFormSchema>;

export const OrganizationEditFormSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  website: z.url().optional(),
  linkedIn: z.url().optional(),
  careersURL: z.url().optional(),
  logoURL: z.url().optional(),
});

export type OrganizationEditFormType = z.infer<
  typeof OrganizationEditFormSchema
>;
