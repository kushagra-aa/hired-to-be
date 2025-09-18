import { buildUrl } from "@hiredtobe/shared/utils";
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

  return c.redirect(
    buildUrl(`${env.GOOGLE_ACCOUNTS_URL}`, "", {
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: buildUrl(
        `${env.CLIENT_BASE_URI}`,
        `${env.OAUTH_REDIRECT_ENDPOINT}`,
      ),
      response_type: "code",
      scope: env.GOOGLE_OAUTH_SCOPES,
      access_type: "offline",
      prompt: "consent",
    }),
  );
}

async function googleCallbackController(c: Context) {
  const env = getEnv(c);
  try {
    const db = getDb(c.env);
    const authCode = c.req.query("code");
    const errorCode = c.req.query("error");
    if (!authCode)
      return c.redirect(
        buildUrl(`${env.CLIENT_BASE_URI}`, "", {
          error_code: errorCode,
          message:
            errorCode && errorCode === "access_denied"
              ? "You need to select an account and allow to Login"
              : "Something Went Wrong!",
          success: false,
        }),
      );
    const userResp = await authService.googleOAuth(env, db, authCode);
    if (userResp.error || !userResp.data)
      return c.redirect(buildUrl(`${env.CLIENT_BASE_URI}`, "", userResp));

    const token = await sessionService.createSession(
      c,
      userResp.data.id,
      userResp.data.role,
    );

    await setSessionCookie(c, token);

    return c.redirect(
      buildUrl(`${env.CLIENT_BASE_URI}`, "", { success: true }),
    );
  } catch {
    return c.redirect(
      buildUrl(`${env.CLIENT_BASE_URI}`, "", {
        message: "Something Went Wrong!",
        success: false,
      }),
    );
  }
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
