import {
  UserEntity,
  UserResponseType,
} from "@shared/types/entities/user.entity.js";

export const toUserDTO = (user: UserEntity): UserResponseType => {
  return {
    ...user,
    password: undefined,
  };
};
