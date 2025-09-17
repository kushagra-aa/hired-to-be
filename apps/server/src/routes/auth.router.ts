import { Hono } from "hono";

import authController from "../controllers/auth.controller";

export const authRoutes = new Hono();

authRoutes.get("/google", authController.google.login);
authRoutes.get("/google/callback", authController.google.callback);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/check-session", authController.checkSession);
