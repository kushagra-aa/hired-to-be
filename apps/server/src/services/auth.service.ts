import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserResponseType,
} from "@hiredtobe/shared/entities";
import { RegistryReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import userRepository from "@/server/repositories/user.repository";
import { toUserDTO } from "@/server/utils/toUserDTO";

export async function registerService(
  db: DbType,
  payload: UserRegisterPayloadType,
): RegistryReturnType<UserResponseType> {
  const existing = await userRepository.findUserByGoogleId(
    db,
    payload.googleID,
  );
  if (existing) {
    return {
      error: "User Already exists with this email",
      message: "Email Already in Use",
      status: 401,
      errors: { email: ["Already Used"] },
    };
  }
  const user = await userRepository.createUser(db, payload);
  return {
    data: toUserDTO(user[0]),
    message: "User Registed Successfully",
    status: 201,
  };
}

export async function loginUser(db: DbType, googleID: string) {
  return userRepository.findUserByGoogleId(db, googleID);
}

async function loginService(
  db: DbType,
  payload: UserLoginPayloadType,
): RegistryReturnType<UserResponseType> {
  const existingUser = await userRepository.findUserByEmail(db, payload.email);
  if (!existingUser) {
    return {
      error: "Invalid Credentials",
      message: "Invalid Credentials",
      status: 401,
    };
  }
  if (existingUser.googleID !== payload.googleID) {
    return {
      error: "Invalid Credentials",
      message: "Invalid Credentials",
      status: 401,
    };
  }
  return {
    data: toUserDTO(existingUser),
    message: "User LoggedIn Successfully",
    status: 200,
  };
}

export default { register: registerService, login: loginService };
