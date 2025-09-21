import { Hono } from "hono";

import { authRoutes } from "./auth.router";
import { healthRoutes } from "./health.route";
import { jobsRoutes } from "./jobs.router";
import { organizationsRoutes } from "./organizations.router";

const routes = (app: Hono) => {
  app.route("/api/health", healthRoutes);
  app.route("/api/auth", authRoutes);
  app.route("/api/organizations", organizationsRoutes);
  app.route("/api/jobs", jobsRoutes);
};
export default routes;
