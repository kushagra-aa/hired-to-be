import {
  ErrorResponseType,
  StatusCode,
  SuccessResponseType,
} from "@hiredtobe/shared/types";
import { Context } from "hono";

import { ValidationErrors } from "../types/validation.type";

/**
 * Sends a standardized API error response in Hono.
 *
 * @param c The Hono context object.
 * @param error The error details.
 */
export const sendAPIError = (
  c: Context,
  error: Partial<ErrorResponseType> & { status?: StatusCode },
) => {
  const status: StatusCode = error.status || 500;
  const resp: ErrorResponseType = {
    ...error,
    status,
    error: error.error || "Internal Server Error",
    message: error.message || "Something went wrong",
  };
  c.status(status);
  return c.json(resp);
};

/**
 * Sends a standardized API success response in Hono.
 *
 * @param c The Hono context object.
 * @param data The success data.
 */
export const sendAPIResponse = <T>(
  c: Context,
  data: Partial<SuccessResponseType<T>> & { status?: StatusCode },
) => {
  const status: StatusCode = data.status || 200;
  const resp: SuccessResponseType<T> = {
    ...data,
    status,
    message: data.message || "Success",
    data: data.data as T,
  };
  c.status(status);
  return c.json(resp);
};

export const sendValidationError = (
  c: Context,
  validationErrors: ValidationErrors,
  message: string = "Invalid User Input",
) => {
  return sendAPIError(c, {
    errors: validationErrors,
    status: 400,
    error: "Validation Error",
    message,
  });
};
