import { UserRoleEnum } from "@shared/types/entities/user.entity.js";

import { roleAuthMiddleware } from "./roleAuth.middleware.js";
import { sessionMiddleware } from "./session.middleware.js";

export const withAuthMiddlewares = (options?: { roles?: UserRoleEnum[] }) => {
  if (options?.roles) {
    return [sessionMiddleware, roleAuthMiddleware(options.roles)];
  }
  return [sessionMiddleware];
};
