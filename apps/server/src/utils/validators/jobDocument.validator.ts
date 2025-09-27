import {
  JobDocumentAddFormSchema,
  JobDocumentAddFormType,
  JobDocumentEditFormSchema,
  JobDocumentEditFormType,
} from "@hiredtobe/shared/schemas";

import { ValidationResult } from "@/server/types/validation.type";

import { errorAsStringArrays } from "./index";

export const jobDocumentValidator = {
  validateAdd(data: unknown): ValidationResult<JobDocumentAddFormType> {
    const result = JobDocumentAddFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data, // ✅ transformed + validated
      };
    }
    return errorAsStringArrays<JobDocumentAddFormType>(result.error);
  },
  validateEdit(data: unknown): ValidationResult<JobDocumentEditFormType> {
    const result = JobDocumentEditFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<JobDocumentEditFormType>(result.error);
  },
};
