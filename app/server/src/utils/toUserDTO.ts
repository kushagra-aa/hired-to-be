import {
  UserEntity,
  UserRoleEnum,
} from "@shared/types/entities/user.entity.js";

import { UserModelType } from "@server/database/models/user.model.js";

export function toUserDTO(dbUser: UserModelType): UserEntity {
  return {
    id: dbUser.id,
    googleID: dbUser.googleID,
    email: dbUser.email,
    fullName: dbUser.fullName ?? undefined,
    role: (dbUser.role as UserRoleEnum) ?? UserRoleEnum.user, // cast string → enum
    isActive: dbUser.isActive,
    createdAt: new Date(dbUser.createdAt), // integer → Date
    updatedAt: new Date(dbUser.updatedAt),
  };
}
