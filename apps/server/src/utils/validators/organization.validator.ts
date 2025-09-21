import {
  OrganizationAddFormSchema,
  OrganizationAddFormType,
  OrganizationEditFormSchema,
  OrganizationEditFormType,
} from "@hiredtobe/shared/schemas";

import { ValidationResult } from "@/server/types/validation.type";

import { errorAsStringArrays } from "./index";

export const organizationValidator = {
  validateAdd(data: unknown): ValidationResult<OrganizationAddFormType> {
    const result = OrganizationAddFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data, // ✅ transformed + validated
      };
    }
    return errorAsStringArrays<OrganizationAddFormType>(result.error);
  },
  validateEdit(data: unknown): ValidationResult<OrganizationEditFormType> {
    const result = OrganizationEditFormSchema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    }

    return errorAsStringArrays<OrganizationEditFormType>(result.error);
  },
};
