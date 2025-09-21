import { Context, Hono } from "hono";

import organizationController from "@/server/controllers/organization.controller";
import { sendAPIResponse } from "@/server/lib/response";
import { withAuthMiddlewares } from "@/server/middlewares";

export const organizationsRoutes = new Hono();

// All /entities require session
organizationsRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

organizationsRoutes.get("", organizationController.getOrganizations);
organizationsRoutes.post("", organizationController.addOrganization);

organizationsRoutes.get("/:id", (c: Context) => {
  const { id } = c.req.param();
  return sendAPIResponse(c, {
    data: { id },
    message: "Organizations Found Successfully",
    status: 200,
  });
});
organizationsRoutes.patch("/:id", organizationController.editOrganization);
