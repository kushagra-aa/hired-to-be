import { NotFoundHandler } from "hono";

import { sendAPIError } from "@server/lib/response.js";

export const notFoundMiddleware: NotFoundHandler = async (c) => {
  return sendAPIError(c, {
    status: 404,
    error: "NotFound",
    message: "The requested resource was not found",
  });
};
