import { Hono } from "hono";

import authController from "../controllers/auth.controller";

export const authRoutes = new Hono();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/check-session", authController.checkSession);
