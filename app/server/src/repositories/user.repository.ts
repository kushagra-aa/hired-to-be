import {
  UserEntity,
  UserRegisterPayloadType,
  UserRoleEnum,
} from "@shared/types/entities/user.entity.js";

import { getClient } from "@server/database/index.js";

async function getUseryID(id: UserEntity["id"]) {
  const client = getClient();
  const users = client.select("users");
  const foundUser = users.find((u) => u.id === id);

  return foundUser || null;
}

async function getUserByEmail(email: UserEntity["email"]) {
  const client = getClient();
  const users = client.select("users");
  const foundUser = users.find((u) => u.email === email);

  return foundUser || null;
}

async function addUser(paylaod: UserRegisterPayloadType) {
  const client = getClient();
  const user = client.insert("users", { ...paylaod, role: UserRoleEnum.admin });

  return user;
}

async function editUser(
  id: UserEntity["id"],
  paylaod: Partial<Omit<UserEntity, "id">>,
) {
  const client = getClient();
  const user = client.update("users", id, { ...paylaod });

  return user;
}

async function deleteUser(id: UserEntity["id"]) {
  const client = getClient();
  const user = client.delete("users", id);

  return user;
}

export default {
  getUseryID,
  getUserByEmail,
  addUser,
  editUser,
  deleteUser,
};
