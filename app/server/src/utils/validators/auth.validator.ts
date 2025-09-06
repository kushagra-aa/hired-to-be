import {
  LoginFormSchema,
  LoginFormType,
  RegisterFormSchema,
  RegisterFormType,
} from "@shared/schemas/auth.schema.js";

import { ValidationResult } from "@server/types/validation.type.js";

import { errorAsStringArrays } from "./index.js";

class AuthValidator {
  validateRegister(data: unknown): ValidationResult<RegisterFormType> {
    const result = RegisterFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data, // ✅ transformed + validated
      };
    }
    return errorAsStringArrays<RegisterFormType>(result.error);
  }

  validateLogin(data: unknown): ValidationResult<LoginFormType> {
    const result = LoginFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<LoginFormType>(result.error);
  }
}

export const authValidator = new AuthValidator();
