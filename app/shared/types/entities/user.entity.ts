import { PartialBy } from "@shared/types/util.types";

export enum UserRoleEnum {
  admin = "ADMIN",
  user = "USER",
}

export type UserEntity = {
  id: number;
  full_name: string;
  password: string;
  email: string;
  role: UserRoleEnum;
};

export type UserResponseType = PartialBy<UserEntity, "password">;

export type UserRegisterPayloadType = Omit<UserEntity, "role" | "id"> & {
  confirm_password: string;
};

export type UserLoginPayloadType = Omit<
  UserEntity,
  "role" | "full_name" | "id"
>;

export type UserSessionType = Omit<
  UserEntity,
  "full_name" | "password" | "email"
>;

export type UserSessionResponseType = { user: UserSessionType; token: string };
