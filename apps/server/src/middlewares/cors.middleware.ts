import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: "http://localhost:5173", // or restrict to specific domains
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
