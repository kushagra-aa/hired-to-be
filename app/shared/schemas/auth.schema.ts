import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email().transform((v) => v),
  password: z
    .string()
    .min(6)
    .transform((v) => v),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z
  .object({
    full_name: z.string().min(3).optional(),
    // .transform((v) => v),
    email: z.email().transform((v) => v),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .transform((v) => v),
    confirm_password: z
      .string()
      .min(6)
      .transform((v) => v),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    // Check for Password and ConfirmPassword being same
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The Passwords did not match",
        path: ["confirm_password"],
      });
    }
  });

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
