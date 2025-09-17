import { sessionModel, userCredentialModel, userModel } from "./user.model";

export * from "./base.model";
export * from "./user.model";

export default {
  user: userModel,
  session: sessionModel,
  userCredential: userCredentialModel,
};
