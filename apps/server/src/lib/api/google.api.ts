import { APIClient } from "@hiredtobe/shared/api";

import { EnvType } from "@/server/config/env";

type GoogleTokenResponseType = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  scope: string;
  refresh_token: string;
};
type GoogleUserResponseType = {
  name: string;
  email: string;
  picture: string;
  sub: string;
};

let apiClient: APIClient;
const setAPIClient = (baseURL: string) => (apiClient = new APIClient(baseURL));

const getGoogleOAuthToken = async (env: EnvType, code: string) => {
  const apiClientOAuth = new APIClient(env.GOOGLE_OAUTH_API_BASE_URL);
  const tokenResp = await apiClientOAuth
    .post(`${env.GOOGLE_OAUTH_TOKEN_ENDPOINT}`, {
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${env.CLIENT_BASE_URI}${env.OAUTH_REDIRECT_ENDPOINT}`,
    })
    .then((res) => res as unknown as GoogleTokenResponseType);
  return tokenResp;
};

const getGoogleUserInfo = async (env: EnvType, accessToken: string) => {
  setAPIClient(env.GOOGLE_API_BASE_URL);
  const userInfoResp = await apiClient
    .get(
      `${env.GOOGLE_API_USER_ENDPOINT}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    .then((res) => res as unknown as GoogleUserResponseType);
  return userInfoResp;
};

export default {
  getOAuthToken: getGoogleOAuthToken,
  getUserInfo: getGoogleUserInfo,
};
