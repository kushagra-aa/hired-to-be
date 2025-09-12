import { BaseEntity } from ".";

// User Roles Source of truth
export enum UserRoleEnum {
  admin = "ADMIN",
  user = "USER",
}

export type UserBaseEntity = {
  fullName?: string | null;
  email: string;
  googleID: string;
  role: UserRoleEnum;
};

export type UserEntity = UserBaseEntity & BaseEntity;

export type UserRegisterPayloadType = Omit<UserBaseEntity, "role">;

export type UserLoginPayloadType = Omit<UserBaseEntity, "role" | "fullName">;

export type UserResponseType = UserEntity;

export type UserSessionType = Omit<UserBaseEntity, "fullName">;

export type UserSessionResponseType = { user: UserSessionType; token: string };
