import { jobModel } from "./job.model";
import { jobDocumentModel } from "./jobDocument.mode";
import { organizationModel } from "./organization.model";
import { recruiterModel } from "./recruiter.model";
import { sessionModel, userCredentialModel, userModel } from "./user.model";

export * from "./base.model";
export * from "./job.model";
export * from "./jobDocument.mode";
export * from "./organization.model";
export * from "./recruiter.model";
export * from "./user.model";

export default {
  user: userModel,
  session: sessionModel,
  userCredential: userCredentialModel,
  job: jobModel,
  jobDocument: jobDocumentModel,
  organization: organizationModel,
  recruiter: recruiterModel,
};
