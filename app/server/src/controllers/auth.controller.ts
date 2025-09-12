import { Context } from "hono";

import { getDb } from "@server/database/index.js";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@server/lib/response.js";
import authService from "@server/services/auth.service.js";
import sessionService, {
  clearSessionCookie,
  setSessionCookie,
  validateRequestSession,
} from "@server/services/session.service.js";
import { authValidator } from "@server/utils/validators/auth.validator.js";

async function registerController(c: Context) {
  const db = getDb(c.env);
  const payload = await c.req.json();
  const validationResult = authValidator.validateRegister(payload);
  if (!validationResult.isValid && validationResult.errors)
    return sendValidationError(c, validationResult.errors);
  const userResp = await authService.register(db, payload);
  if (userResp.error || !userResp.data) return sendAPIError(c, userResp);

  const token = await sessionService.createSession(
    c,
    userResp.data.googleID,
    userResp.data.role,
  );

  await setSessionCookie(c, token);

  return sendAPIResponse(c, {
    data: userResp.data,
    message: userResp.message,
    status: userResp.status,
  });
}

async function loginController(c: Context) {
  const db = getDb(c.env);
  const payload = await c.req.json();
  const validationResult = authValidator.validateLogin(payload);
  if (!validationResult.isValid && validationResult.errors)
    return sendValidationError(c, validationResult.errors);
  const userResp = await authService.login(db, payload);
  if (userResp.error || !userResp.data) return sendAPIError(c, userResp);

  const token = await sessionService.createSession(
    c,
    userResp.data.googleID,
    userResp.data.role,
  );

  await setSessionCookie(c, token);

  return sendAPIResponse(c, {
    data: userResp.data,
    message: userResp.message,
    status: userResp.status,
  });
}

async function logoutController(c: Context) {
  await clearSessionCookie(c);
  return sendAPIResponse(c, {
    data: {},
    message: "User LoggedOut Successfully",
    status: 200,
  });
}

async function checkSessionController(c: Context) {
  const sessionResp = await validateRequestSession(c);
  if (sessionResp && sessionResp.session) {
    return sendAPIResponse(c, {
      data: {
        user: { id: sessionResp.session.id, role: sessionResp.session.role },
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
  register: registerController,
  login: loginController,
  logout: logoutController,
  checkSession: checkSessionController,
};
