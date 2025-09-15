import { Hono } from "hono";

import { authRoutes } from "./auth.router";
import { entityRoutes } from "./entity.router";
import { healthRoutes } from "./health.route";

const routes = (app: Hono) => {
  app.route("/api/health", healthRoutes);
  app.route("/api/auth", authRoutes);
  app.route("/api/entities", entityRoutes);
};
export default routes;
