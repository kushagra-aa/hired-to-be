import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email().transform((v) => v),
  googleID: z
    .string()
    .min(6)
    .transform((v) => v),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z
  .object({
    fullName: z.string().min(3).max(255).optional(),
    // .transform((v) => v),
    email: z.email().transform((v) => v),
    googleID: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .transform((v) => v),
    confirm_googleID: z
      .string()
      .min(6)
      .transform((v) => v),
  })
  .superRefine(({ googleID, confirm_googleID }, ctx) => {
    // Check for Password and ConfirmPassword being same
    if (confirm_googleID !== googleID) {
      ctx.addIssue({
        code: "custom",
        message: "The Google IDs did not match",
        path: ["confirm_googleID"],
      });
    }
  });

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
