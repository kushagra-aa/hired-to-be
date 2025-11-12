import { Context, Hono } from "hono";

import { getStaticAsset } from "./lib/static";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import routes from "./routes/index";

const app = new Hono({
  strict: false, // To treat `/entities` and `/entities/` as same.
});

// Global middlewares
app.use("*", loggerMiddleware);
app.use("*", corsMiddleware);

// Routes
routes(app);

// Serve the React app (with router support)
app.get("/app/*", async (c: Context) => {
  const appLocation = await getStaticAsset(c, "/app/index.html");
  // Return your React app’s index.html (from dist/app)
  const html = await c.env.ASSETS.fetch(appLocation);
  return html;
});

// Not found handler
app.notFound(notFoundMiddleware);

// export default app;
export default app;
