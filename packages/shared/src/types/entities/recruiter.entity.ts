import { BaseEntity, JobEntity, OrganizationEntity } from ".";

export type RecruiterBaseEntity = {
  jobID: JobEntity["id"];
  orgID: OrganizationEntity["id"];
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
};

export type RecruiterEntity = RecruiterBaseEntity & BaseEntity;
