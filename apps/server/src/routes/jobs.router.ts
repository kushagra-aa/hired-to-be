import { Hono } from "hono";

import jobController from "@/server/controllers/job.controller";
import { withAuthMiddlewares } from "@/server/middlewares";

export const jobsRoutes = new Hono();

// All /entities require session
jobsRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

jobsRoutes.get("", jobController.getJobs);
jobsRoutes.post("", jobController.addJob);

jobsRoutes.get("/:id", jobController.getJob);
jobsRoutes.patch("/:id", jobController.editJob);
jobsRoutes.patch("/:id/status", jobController.editJobStatus);
jobsRoutes.delete("/:id", jobController.deleteJob);
