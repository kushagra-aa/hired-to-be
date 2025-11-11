import { BaseEntity, OrganizationEntity, UserEntity } from ".";

export type RecruiterBaseEntity = {
  userID: UserEntity["id"];
  orgID: OrganizationEntity["id"];
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
};

export type RecruiterEntity = RecruiterBaseEntity & BaseEntity;

export type RecruiterAddPayloadType = Omit<RecruiterBaseEntity, "userID">;
export type RecruiterEditPayloadType = Partial<
  Omit<RecruiterBaseEntity, "orgID" | "userID">
>;

export type RecruiterResponseType = RecruiterEntity & {
  organization?: OrganizationEntity;
};
