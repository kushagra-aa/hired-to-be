import { Hono } from "hono";

import { authRoutes } from "./auth.router.js";
import { entityRoutes } from "./entity.router.js";
import { healthRoutes } from "./health.route.js";

const routes = (app: Hono) => {
  app.route("/api/health", healthRoutes);
  app.route("/api/auth", authRoutes);
  app.route("/api/entities", entityRoutes);
};
export default routes;
