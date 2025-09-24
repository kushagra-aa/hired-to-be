import {
  JobAddFormSchema,
  JobAddFormType,
  JobEditFormSchema,
  JobEditFormType,
  JobEditStatusFormSchema,
  JobEditStatusFormType,
} from "@hiredtobe/shared/schemas";

import { ValidationResult } from "@/server/types/validation.type";

import { errorAsStringArrays } from "./index";

export const jobValidator = {
  validateAdd(data: unknown): ValidationResult<JobAddFormType> {
    const result = JobAddFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data, // ✅ transformed + validated
      };
    }
    return errorAsStringArrays<JobAddFormType>(result.error);
  },
  validateEdit(data: unknown): ValidationResult<JobEditFormType> {
    const result = JobEditFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<JobEditFormType>(result.error);
  },
  validateEditStatus(data: unknown): ValidationResult<JobEditStatusFormType> {
    const result = JobEditStatusFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<JobEditStatusFormType>(result.error);
  },
};
