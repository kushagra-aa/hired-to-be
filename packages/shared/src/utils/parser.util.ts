import { z } from "zod";

import { ApiError } from "../lib";

/**
 * Parses a query param into JSON object or array safely
 *
 * @example
 * // /organizations?ids=1,2,3
 * const ids = parseJsonParam(query.ids, z.array(z.number()));
 * // => [1,2,3]
 * 
 * @example
 * // /organizations?filters={"status":["applied","interview"],"salary":100000}
const filters = parseJsonParam(
 *  query.filters,
 *  z.object({
 *    status: z.array(z.string()).optional(),
 *    salary: z.number().optional(),
 *  })
 * );
 * // => { status: ['applied','interview'], salary: 100000 }
 */
export function parseJsonParam<T>(
  raw: string | string[] | undefined,
  schema: z.ZodType<T>,
): T | undefined {
  if (!raw) return undefined;

  try {
    // If query param is in ArrayString → turn into array
    if (Array.isArray(raw) && raw[0].includes(",")) {
      return schema.parse(raw[0].split(",")) as T;
    }

    // If repeated query params → take array directly
    if (Array.isArray(raw)) {
      return schema.parse(raw);
    }

    // If comma separated values → turn into array
    if (raw.includes(",") && schema instanceof z.ZodArray) {
      return schema.parse(raw.split(",")) as T;
    }

    // Otherwise try JSON.parse()
    return schema.parse(JSON.parse(raw));
  } catch (err) {
    console.error("Failed to parse JSON param:", err);
    throw new ApiError("Invalid query parameter format", 400);
  }
}
