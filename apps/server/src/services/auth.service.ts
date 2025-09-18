import {
  ProvidersEnum,
  UserLoginResponseType,
  UserRegisterPayloadType,
  UserResponseType,
} from "@hiredtobe/shared/entities";
import { RegistryReturnType } from "@hiredtobe/shared/types";

import { DbType } from "@/server/database";
import userRepository from "@/server/repositories/user.repository";
import { toUserDTO } from "@/server/utils/toUserDTO";

import { EnvType } from "../config/env";
import { UserModelType } from "../database/models";
import googleApi from "../lib/api/google.api";
import userCredentialRepository from "../repositories/userCredential.repository";

export async function registerService(
  db: DbType,
  payload: UserRegisterPayloadType,
): RegistryReturnType<UserResponseType> {
  const existing = await userRepository.findUserByGoogleId(
    db,
    payload.googleID,
  );
  if (existing) {
    return {
      error: "User Already exists with this email",
      message: "Email Already in Use",
      status: 401,
      errors: { email: ["Already Used"] },
    };
  }
  const user = await userRepository.createUser(db, payload);
  return {
    data: toUserDTO(user[0]),
    message: "User Registed Successfully",
    status: 201,
  };
}

export async function loginUser(db: DbType, googleID: string) {
  return userRepository.findUserByGoogleId(db, googleID);
}

async function googleOAuthService(
  env: EnvType,
  db: DbType,
  code: string,
): RegistryReturnType<UserLoginResponseType> {
  const tokenResp = await googleApi.getOAuthToken(env, code);
  if (!tokenResp || !tokenResp.access_token) {
    return {
      error: "Failed to fetch access token from Google",
      message: "OAuth Error",
      status: 500,
    };
  }

  const { access_token: accessToken } = tokenResp;
  const userInfoResp = await googleApi.getUserInfo(env, accessToken);
  const { email: userEmail, name } = userInfoResp;

  const existingUser = await userRepository.findUserByEmail(db, userEmail);
  let newUser: UserModelType[] = [];

  if (!existingUser) {
    const newUserPayload: UserRegisterPayloadType = {
      email: userEmail,
      image: userInfoResp.picture || "",
      fullName: name,
      googleID: userInfoResp.sub,
    };

    newUser = await userRepository.createUser(db, newUserPayload);
    if (!newUser || newUser.length === 0) {
      return {
        error: "Failed to create user",
        status: 500,
        message: "User Registration Error",
      };
    }
  }
  const user: UserModelType = existingUser ? existingUser : newUser[0];
  if (user) {
    await userCredentialRepository.createUserCredential(db, {
      accessToken: tokenResp.access_token,
      expiry: tokenResp.expires_in,
      provider: ProvidersEnum.google,
      scopes: tokenResp.scope.split(" "),
      refreshToken: tokenResp.refresh_token,
      userID: user.id,
    });
  }

  return {
    data: { ...toUserDTO(user), token: accessToken },
    message: "User LoggedIn Successfully",
    status: 200,
  };
}

export default { register: registerService, googleOAuth: googleOAuthService };
