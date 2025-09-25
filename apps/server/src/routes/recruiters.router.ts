import { Hono } from "hono";

import recruiterController from "@/server/controllers/recruiter.controller";
import { withAuthMiddlewares } from "@/server/middlewares";

export const recruitersRoutes = new Hono();

// All /entities require session
recruitersRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

recruitersRoutes.get("", recruiterController.getRecruiters);
recruitersRoutes.post("", recruiterController.addRecruiter);

recruitersRoutes.patch("/:id", recruiterController.editRecruiter);
recruitersRoutes.delete("/:id", recruiterController.deleteRecruiter);
