export * from "./user.entity";
export * from "./userCredentials.entity";

export type BaseEntity = {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionBaseEntity = {
  userID: number;
  expiresAt: Date;
};
export type SessionEntity = SessionBaseEntity & BaseEntity;

export type SessionAddPayloadType = Omit<SessionBaseEntity, "expiresAt"> & {
  expiresAt: number;
};
