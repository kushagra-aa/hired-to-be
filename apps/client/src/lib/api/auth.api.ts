import {
  UserEntity,
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserSessionResponseType,
} from "@hiredtobe/shared/entities";
import { APIClient } from "@hiredtobe/shared/lib";
import { SuccessResponseType } from "@hiredtobe/shared/types";

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
