import { APIClient } from "@shared/lib/api/index.js";
import { SuccessResponseType } from "@shared/types/api.types.js";
import {
  UserEntity,
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserSessionResponseType,
} from "@shared/types/entities/user.entity.js";

const client = new APIClient("/api/auth");

export async function loginAPI(
  payload: UserLoginPayloadType,
): Promise<SuccessResponseType<UserEntity>> {
  const resp = await client.post<UserEntity>("/login", payload);
  return resp;
}

export async function registerAPI(
  payload: UserRegisterPayloadType,
): Promise<SuccessResponseType<UserEntity>> {
  const resp = await client.post<UserEntity>("/register", payload);
  return resp;
}

export async function logoutAPI(): Promise<SuccessResponseType> {
  const resp = await client.post("/logout");
  return resp;
}

export async function checkSessionAPI(): Promise<
  SuccessResponseType<UserSessionResponseType | null>
> {
  const resp = await client.get<UserSessionResponseType>("/check-session");
  return resp;
}
