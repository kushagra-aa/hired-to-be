export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationErrors;
}

export type ValidationErrors = Record<string, string[]>;
