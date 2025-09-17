import { Context } from "hono";

import { getDb } from "@/server/database";
import { sendAPIError, sendAPIResponse } from "@/server/lib/response";
import authService from "@/server/services/auth.service";
import sessionService, {
  clearSessionCookie,
  setSessionCookie,
  validateRequestSession,
} from "@/server/services/session.service";

import { getEnv } from "../config/env";

async function googleLoginController(c: Context) {
  const env = getEnv(c);
  const oAuthURL = new URL(env.GOOGLE_ACCOUNTS_URL);

  oAuthURL.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  oAuthURL.searchParams.set(
    "redirect_uri",
    `${env.CLIENT_BASE_URI}${env.OAUTH_REDIRECT_ENDPOINT}`,
  );
  oAuthURL.searchParams.set("response_type", "code");
  oAuthURL.searchParams.set("scope", env.GOOGLE_OAUTH_SCOPES);
  // TODO: state
  oAuthURL.searchParams.set("access_type", "offline");
  oAuthURL.searchParams.set("prompt", "consent");

  return c.redirect(oAuthURL.toString());
}

async function googleCallbackController(c: Context) {
  const db = getDb(c.env);
  const env = getEnv(c);
  const authCode = c.req.query("code");
  const errorCode = c.req.query("error");
  if (!authCode)
    return sendAPIError(c, {
      error: "Invalid Request",
      message:
        errorCode && errorCode === "access_denied"
          ? "You need to select an account and allow to Login"
          : "Authorization Code is required",
      status: 400,
    });
  const userResp = await authService.googleOAuth(env, db, authCode);
  if (userResp.error || !userResp.data) return sendAPIError(c, userResp);

  const token = await sessionService.createSession(
    c,
    userResp.data.id,
    userResp.data.role,
  );

  await setSessionCookie(c, token);

  return c.redirect(`${env.CLIENT_BASE_URI}`);
}

async function logoutController(c: Context) {
  const sessionResp = await validateRequestSession(c);
  if (sessionResp && sessionResp.session)
    await sessionService.endSession(c, sessionResp?.session?.sid);
  await clearSessionCookie(c);
  return sendAPIResponse(c, {
    data: {},
    message: "User LoggedOut Successfully",
    status: 200,
  });
}

async function checkSessionController(c: Context) {
  const sessionResp = await sessionService.validateSession(c);
  if (sessionResp && sessionResp.session) {
    return sendAPIResponse(c, {
      data: {
        user: { id: sessionResp.session.sub, role: sessionResp.session.role },
        token: sessionResp.token,
      },
      message: "User is LoggedIn",
      status: 200,
    });
  }
  await clearSessionCookie(c);
  return sendAPIError(c, {
    error: "UnAuthorized",
    message: "User is not LoggedIn",
    status: 401,
  });
}

export default {
  google: {
    login: googleLoginController,
    callback: googleCallbackController,
  },
  logout: logoutController,
  checkSession: checkSessionController,
};
