import { BaseEntity, OrganizationEntity, UserEntity } from ".";

// Job Status Source of truth
export enum JobStatusEnum {
  applied = "APPLIED",
  screening = "SCREENING",
  interview = "INTERVIEW",
  offer = "OFFER",
  rejected = "REJECTED",
  accepted = "ACCEPTED",
  withdrawn = "WITHDRAWN",
}

export type JobDocumentBaseEntity = {
  jobID: JobEntity["id"];
  type: string;
  url: string;
};
export type JobDocumentEntity = JobDocumentBaseEntity & BaseEntity;

export type JobBaseEntity = {
  userID: UserEntity["id"];
  orgID: OrganizationEntity["id"];
  title: string;
  location: string;
  jdLink: string;
  expectedSalary: number;
  status: JobStatusEnum;
};

export type JobEntity = JobBaseEntity & BaseEntity;

export type JobAddPayloadType = JobBaseEntity & {
  userID: number;
};

export type JobEditPayloadType = Partial<
  Omit<JobBaseEntity, "orgID" | "userID">
>;
