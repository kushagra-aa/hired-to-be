import { Context, Hono } from "hono";

import { sendAPIResponse } from "@/server/lib/response";
import { withAuthMiddlewares } from "@/server/middlewares";

export const jobsRoutes = new Hono();

// All /entities require session
jobsRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

jobsRoutes.get("", (c: Context) => {
  const { id, role } = c.get("user");
  const query = c.req.query("query"); // Get a single value
  //   const queries = c.req.queries(); // Get query Object
  const filtersString = c.req.query("filters"); // Get a JSON Object value
  const filters = filtersString ? JSON.parse(filtersString) : null;

  // For multiple values for the same key (e.g., ?tag=a&tag=b)
  const tags = c.req.queries("tag"); // Returns an array: ['a', 'b']

  // Iterate over all search params
  // for (const [key, value] of c.req.queries()) {
  //   console.log(`${key}: ${value}`);
  // }

  return sendAPIResponse(c, {
    data: {
      id,
      role,
      query: {
        query,
        filters,
        tags,
      },
    },
    message: "Server Running Successfully",
    status: 200,
  });
});

jobsRoutes.get("/:id", (c: Context) => {
  const { id } = c.req.param();
  return sendAPIResponse(c, {
    data: { id },
    message: "Server Running Successfully",
    status: 200,
  });
});
