import { RegistryReturnType } from "@shared/types/api.types.js";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserResponseType,
} from "@shared/types/entities/user.entity.js";

import { hashPassword, verifyPassword } from "@server/lib/bcrypt.js";
import userRepository from "@server/repositories/user.repository.js";
import { toUserDTO } from "@server/utils/toUserDTO.js";

async function registerService(
  payload: UserRegisterPayloadType,
): RegistryReturnType<UserResponseType> {
  const existingUser = await userRepository.getUserByEmail(payload.email);
  if (existingUser)
    return {
      error: "User Already exists with this email",
      message: "Email Already in Use",
      status: 401,
      errors: { email: ["Already Used"] },
    };
  const hashedPassword = await hashPassword(payload.password);
  const user = await userRepository.addUser({
    ...payload,
    password: hashedPassword,
  });
  return {
    data: toUserDTO(user),
    message: "User Registed Successfully",
    status: 201,
  };
}

async function loginService(
  payload: UserLoginPayloadType,
): RegistryReturnType<UserResponseType> {
  const existingUser = await userRepository.getUserByEmail(payload.email);
  if (!existingUser)
    return {
      error: "Invalid Credentials",
      message: "Invalid Credentials",
      status: 401,
    };
  const compareResult = await verifyPassword(
    payload.password,
    existingUser.password,
  );
  if (!compareResult)
    return {
      error: "Invalid Credentials",
      message: "Invalid Credentials",
      status: 401,
    };

  return {
    data: toUserDTO(existingUser),
    message: "User LoggedIn Successfully",
    status: 200,
  };
}

export default { register: registerService, login: loginService };
