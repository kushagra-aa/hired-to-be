import { UserRoleEnum } from "./entities/user.entity";

export type SessionPayload = {
  id: string;
  role: UserRoleEnum;
  exp: number;
  iat: number;
};

export type SessionConfigType = {
  secretKey: string;
  defaultTTL: number;
};
