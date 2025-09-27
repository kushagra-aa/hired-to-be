import { Hono } from "hono";

import { authRoutes } from "./auth.router";
import { healthRoutes } from "./health.route";
import { jobDocumentsRoutes } from "./jobDocuments.router";
import { jobsRoutes } from "./jobs.router";
import { organizationsRoutes } from "./organizations.router";
import { recruitersRoutes } from "./recruiters.router";

const routes = (app: Hono) => {
  app.route("/api/health", healthRoutes);
  app.route("/api/auth", authRoutes);
  app.route("/api/organizations", organizationsRoutes);
  app.route("/api/jobs", jobsRoutes);
  app.route("/api/jobs/:id/docs", jobDocumentsRoutes);
  app.route("/api/recruiters", recruitersRoutes);
};
export default routes;
