import { UserRoleEnum } from "./entities/user.entity";

export type SessionPayload = {
  sub: string;
  sid: string;
  role: UserRoleEnum;
  exp: number;
  iat: number;
};

export type SessionConfigType = {
  secretKey: string;
  defaultTTL: number;
};
