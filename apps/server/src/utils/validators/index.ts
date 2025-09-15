import { ZodError } from "zod";

import { ValidationResult } from "@/server/types/validation.type";

/**
 * Convert ZodError into { field: ["msg1", "msg2"] }
 */
export function errorAsStringArrays<T>(error: ZodError): ValidationResult<T> {
  const errors: Record<string, string[]> = {};
  error.issues.forEach((issue) => {
    const field = issue.path.join(".") || "form";
    if (!errors[field]) errors[field] = [];
    errors[field].push(issue.message);
  });

  return {
    isValid: false,
    errors,
  };
}
