import { UserRoleEnum } from "@shared/types/entities/user.entity.js";
import { Context, Hono } from "hono";

import { sendAPIResponse } from "@server/lib/response.js";
import { withAuthMiddlewares } from "@server/middlewares/index.js";

export const entityRoutes = new Hono();

// All /entities require session
// entityRoutes.use("/*", sessionMiddleware);  // use this approach for 'global' application of middleware

entityRoutes.get(
  "",
  // sessionMiddleware, // This can also be used to set middleware for specific rou
  ...withAuthMiddlewares(), // No Role Auth
  (c: Context) => {
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
  },
);

entityRoutes.get("/:id", (c: Context) => {
  const { id } = c.req.param();
  return sendAPIResponse(c, {
    data: { id },
    message: "Server Running Successfully",
    status: 200,
  });
});

entityRoutes.get("/:id/nest/:nest_id", (c: Context) => {
  const { id, nest_id: nestId } = c.req.param();
  return sendAPIResponse(c, {
    data: { id, nestId },
    message: "Server Running Successfully",
    status: 200,
  });
});

// Public route, no Auth
entityRoutes.get("/:id/public", (c: Context) => {
  const { id } = c.req.param();
  return sendAPIResponse(c, {
    data: { id },
    message: "Server Running Successfully",
    status: 200,
  });
});

// Session-only route (no role)
entityRoutes.get(
  "/:id/basic",
  ...withAuthMiddlewares(), // No Role Auth
  (c: Context) => {
    const { id } = c.req.param();
    return sendAPIResponse(c, {
      data: { id },
      message: "Server Running Successfully",
      status: 200,
    });
  },
);

// Admin-only routes
// entityRoutes.use("/:id/*", roleAuthMiddleware([UserRoleEnum.admin]));
entityRoutes.get(
  "/:id/secure",
  ...withAuthMiddlewares({ roles: [UserRoleEnum.admin] }), // Admin Only Role Auth
  (c: Context) => {
    const { id } = c.req.param();
    return sendAPIResponse(c, {
      data: { id },
      message: "Server Running Successfully",
      status: 200,
    });
  },
);
