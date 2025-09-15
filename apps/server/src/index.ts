import { Context, Hono } from "hono";

import { getDb } from "./database/index";
import { userModel } from "./database/models/user.model";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import routes from "./routes/index";

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
