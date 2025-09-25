import { BaseEntity, JobEntity, OrganizationEntity, UserEntity } from ".";

export type RecruiterBaseEntity = {
  userID: UserEntity["id"];
  jobID: JobEntity["id"];
  orgID: OrganizationEntity["id"];
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
};

export type RecruiterEntity = RecruiterBaseEntity & BaseEntity;

export type RecruiterAddPayloadType = Omit<
  RecruiterBaseEntity,
  "userID" | "orgID"
>;
export type RecruiterEditPayloadType = Partial<
  Omit<RecruiterBaseEntity, "orgID" | "userID">
>;

export type RecruiterResponseType = RecruiterEntity & {
  job?: JobEntity;
  organization?: OrganizationEntity;
};
