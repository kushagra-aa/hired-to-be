import { Hono } from "hono";

import organizationController from "@/server/controllers/organization.controller";
import { withAuthMiddlewares } from "@/server/middlewares";

export const organizationsRoutes = new Hono();

// All /entities require session
organizationsRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

organizationsRoutes.get("", organizationController.getOrganizations);
organizationsRoutes.post("", organizationController.addOrganization);

organizationsRoutes.patch("/:id", organizationController.editOrganization);
organizationsRoutes.delete("/:id", organizationController.deleteOrganization);
