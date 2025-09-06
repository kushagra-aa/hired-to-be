import { Context, ErrorHandler } from "hono";

import { sendAPIError } from "@server/lib/response.js";

export const errorHandlerMiddleware: ErrorHandler = async (
  err: Error,
  c: Context,
) => {
  console.error("Unhandled Error:", err);
  return sendAPIError(c, {
    status: 500,
    error: "InternalServerError",
    message:
      err instanceof Error ? err.message : "An unexpected error occurred",
  });
};
