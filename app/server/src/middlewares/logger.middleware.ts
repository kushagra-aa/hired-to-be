import { MiddlewareHandler } from "hono";

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // eslint-disable-next-line no-console
  console.log(
    `${new Date().toISOString()} -- ${c.req.method} ${c.req.url} - ${ms}ms`,
  );
};
