import z from "zod";

export const JobDocumentAddFormSchema = z.object({
  type: z.string().min(1).max(255),
  url: z.url(),
});

export type JobDocumentAddFormType = z.infer<typeof JobDocumentAddFormSchema>;

export const JobDocumentEditFormSchema = z.object({
  type: z.string().min(1).max(255).optional(),
  url: z.url().optional(),
});

export type JobDocumentEditFormType = z.infer<typeof JobDocumentEditFormSchema>;
