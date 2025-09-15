import { UserRoleEnum } from "@hiredtobe/shared/entities";

import { roleAuthMiddleware } from "./roleAuth.middleware";
import { sessionMiddleware } from "./session.middleware";

export const withAuthMiddlewares = (options?: { roles?: UserRoleEnum[] }) => {
  if (options?.roles) {
    return [sessionMiddleware, roleAuthMiddleware(options.roles)];
  }
  return [sessionMiddleware];
};
