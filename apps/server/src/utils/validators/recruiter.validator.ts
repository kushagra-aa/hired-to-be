import {
  RecruiterAddFormSchema,
  RecruiterAddFormType,
  RecruiterEditFormSchema,
  RecruiterEditFormType,
} from "@hiredtobe/shared/schemas";

import { ValidationResult } from "@/server/types/validation.type";

import { errorAsStringArrays } from "./index";

export const recruiterValidator = {
  validateAdd(data: unknown): ValidationResult<RecruiterAddFormType> {
    const result = RecruiterAddFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data, // ✅ transformed + validated
      };
    }
    return errorAsStringArrays<RecruiterAddFormType>(result.error);
  },
  validateEdit(data: unknown): ValidationResult<RecruiterEditFormType> {
    const result = RecruiterEditFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<RecruiterEditFormType>(result.error);
  },
};
