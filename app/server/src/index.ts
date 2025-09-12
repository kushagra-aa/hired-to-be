import { Context, Hono } from "hono";

import { getDb } from "./database/index.js";
import { userModel } from "./database/models/user.model.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import routes from "./routes/index.js";

const app = new Hono({
  strict: false, // To treat `/entities` and `/entities/` as same.
});

// Global middlewares
app.use("*", loggerMiddleware);
app.use("*", corsMiddleware);

app.get("/ping", async (c: Context) => {
  const db = getDb(c.env);
  const result = await db.select().from(userModel);
  return c.json(result);
});

// Routes
routes(app);

// app.use("*", serveStatic({ manifest: {} }));

// Error handler
app.onError(errorHandlerMiddleware);
// Not found handler
app.notFound(notFoundMiddleware);

// export default app;
export default app;
