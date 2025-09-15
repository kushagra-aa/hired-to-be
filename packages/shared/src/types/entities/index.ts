export * from "./user.entity";

export type BaseEntity = {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
