import { BaseEntity, JobEntity, RecruiterEntity } from ".";

export type OrganizationBaseEntity = {
  name: string;
  website?: string | null;
  linkedIn?: string | null;
  careersURL?: string | null;
  logoURL?: string | null;
};

export type OrganizationOptionType = {
  label: OrganizationBaseEntity["name"];
  value: string;
};

export type OrganizationEntity = OrganizationBaseEntity & BaseEntity;

export type OrganizationAddPayloadType = OrganizationBaseEntity & {
  userID: number;
};

export type OrganizationEditPayloadType = Partial<OrganizationBaseEntity>;

export type OrganizationFullEntity = OrganizationEntity & {
  recruiters: RecruiterEntity[];
  jobs: JobEntity[];
};
