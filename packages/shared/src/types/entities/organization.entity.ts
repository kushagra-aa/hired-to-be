import { BaseEntity } from ".";

export type OrganizationBaseEntity = {
  name: string;
  website?: string | null;
  linkedIn?: string | null;
  careersURL?: string | null;
  logoURL?: string | null;
};

export type OrganizationEntity = OrganizationBaseEntity & BaseEntity;
