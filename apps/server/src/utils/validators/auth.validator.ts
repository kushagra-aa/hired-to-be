import {
  LoginFormSchema,
  LoginFormType,
  RegisterFormSchema,
  RegisterFormType,
} from "@hiredtobe/shared/schemas";

import { ValidationResult } from "@/server/types/validation.type";

import { errorAsStringArrays } from "./index";

class AuthValidator {
  validateRegister(
    data: unknown,
  ): ValidationResult<Omit<RegisterFormType, "confirm_googleID">> {
    const result = RegisterFormSchema.omit({
      confirm_googleID: true,
    }).safeParse(data);

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
