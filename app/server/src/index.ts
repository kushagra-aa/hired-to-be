import { Hono } from "hono";

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

// Routes
routes(app);

// app.use("*", serveStatic({ manifest: {} }));

// Error handler
app.onError(errorHandlerMiddleware);
// Not found handler
app.notFound(notFoundMiddleware);

// export default app;
export default app;
