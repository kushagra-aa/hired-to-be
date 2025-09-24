import { ApiError } from "@hiredtobe/shared/api";
import { Context, ErrorHandler } from "hono";

import { sendAPIError } from "@/server/lib/response";

export const errorHandlerMiddleware: ErrorHandler = async (
  err: Error,
  c: Context,
) => {
  console.error("Unhandled Error:", err);
  return sendAPIError(c, {
    status: (err as unknown as ApiError).statusCode || 500,
    error: "InternalServerError",
    message:
      err instanceof Error ? err.message : "An unexpected error occurred",
  });
};
