import { BaseEntity } from ".";

export enum ProvidersEnum {
  google = "GOOGLE",
}

export type UserCredentialBaseEntity = {
  accessToken: string;
  refreshToken: string;
  expiry: Date;
  userID: number;
  provider: ProvidersEnum;
};

export type UserCredentialEntity = UserCredentialBaseEntity & BaseEntity;
export type UserCredentialResponseType = UserCredentialEntity;

export type UserCredentialAddPayloadType = Omit<
  UserCredentialBaseEntity,
  "expiry"
> & {
  expiry: number; // timestamp
};
