import {
  UserEntity,
  UserRoleEnum,
} from "@shared/types/entities/user.entity.js";

export function generateBase36NumericId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return parseInt(timestamp + random, 36);
}

const DATABASE: {
  users: UserEntity[];
} = {
  users: [
    {
      id: 1,
      role: UserRoleEnum.admin,
      full_name: "Admin Man",
      email: "admin@example.com",
      password:
        "$pbkdf2$100000$31bc2de243dc3b7dfd6ba1a37d2a8733$f32999e1ec5783fd760ef721ef496caf83a931a5876347c911c6817facb3aee6",
    },
    {
      id: 2,
      role: UserRoleEnum.user,
      full_name: "User Man",
      email: "user@example.com",
      password:
        "$pbkdf2$100000$31bc2de243dc3b7dfd6ba1a37d2a8733$f32999e1ec5783fd760ef721ef496caf83a931a5876347c911c6817facb3aee6",
    },
  ],
};

type DatabaseType = typeof DATABASE;
type DatabaseKeyType = keyof DatabaseType;
type DatabaseEntityType = DatabaseType[DatabaseKeyType][number];
type DatabaseAddEntityType = Omit<DatabaseEntityType, "id">;
type DatabaseEditEntityType = Partial<Omit<DatabaseEntityType, "id">>;

type ClientType = {
  select: (key: DatabaseKeyType) => DatabaseType[DatabaseKeyType];
  insert: (
    key: DatabaseKeyType,
    value: DatabaseAddEntityType,
  ) => DatabaseEntityType;
  update: (
    key: DatabaseKeyType,
    id: number,
    value: DatabaseEditEntityType,
  ) => DatabaseEntityType;
  delete: (key: DatabaseKeyType, id: number) => void;
};

export const getClient = (): ClientType => ({
  select: (key) => DATABASE[key],
  insert(key, value) {
    const newEntry: DatabaseEntityType = {
      ...value,
      id: generateBase36NumericId(),
    };
    DATABASE[key].push(newEntry);
    return newEntry;
  },
  update(key, id, value) {
    const newEntry = { ...value, id };
    const table = DATABASE[key];
    DATABASE[key] = table.map((oldEntity) =>
      oldEntity.id === id ? { ...oldEntity, ...newEntry } : oldEntity,
    );
    const entity = DATABASE[key].find((e) => e.id === id);
    return entity!;
  },
  delete(key, id) {
    const table = DATABASE[key];
    DATABASE[key] = table.filter((oldEntity) => oldEntity.id !== id);
  },
});
