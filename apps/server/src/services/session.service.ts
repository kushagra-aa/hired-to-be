import { UserRoleEnum, UserSessionType } from "@hiredtobe/shared/entities";
import { SessionPayload } from "@hiredtobe/shared/types";
import {
  expiresIn as getExpiresIn,
  nowInSeconds,
} from "@hiredtobe/shared/utils";
import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { getEnv } from "@/server/config/env";
import {
  createSessionToken,
  getSessionAge,
  getSessionConfig,
  validateSessionToken,
} from "@/server/lib/session";
import { SESSION_COOKIE_NAME } from "@/server/utils/constants";

import { getDb } from "../database";
import sessionRepository from "../repositories/session.repository";
import userRepository from "../repositories/user.repository";

/**
 * Create a new session token for a user
 */
const createSessionService = async (
  c: Context,
  userID: UserSessionType["id"],
  role: UserRoleEnum,
  options?: {
    rememberMe?: boolean;
    deviceInfo?: string;
  },
): Promise<string> => {
  const db = getDb(c.env);
  const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
    getEnv(c);

  const sessionConfig = getSessionConfig(SESSION_SECRET, {
    days: SESSION_MAX_AGE_DAYS,
    hours: SESSION_MAX_AGE_HOURS,
  });

  const nowSec = nowInSeconds();
  const sessionAge = getSessionAge(
    sessionConfig.defaultTTL,
    options?.rememberMe,
  );
  const expiresIn = getExpiresIn(sessionAge);

  const session = await sessionRepository.createSession(db, {
    expiresAt: expiresIn,
    userID: userID,
  });
  if (!session || !session.length) throw new Error("Failed to create session");

  const payload: SessionPayload = {
    sub: String(userID),
    sid: String(session[0].id),
    role,
    iat: nowSec,
    exp: expiresIn, // in seconds
  };

  const token = await createSessionToken(payload, sessionConfig);

  return token;
};

/**
 * Validate a session token and return payload
 */
const validateSessionService = async (
  c: Context,
): Promise<{ session: SessionPayload | null; token: string } | null> => {
  const token = getSessionFromRequest(c);
  if (!token) return null;

  const db = getDb(c.env);
  const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
    getEnv(c);

  const sessionConfig = getSessionConfig(SESSION_SECRET, {
    days: SESSION_MAX_AGE_DAYS,
    hours: SESSION_MAX_AGE_HOURS,
  });

  const payload = await validateSessionToken(token, sessionConfig);
  if (!payload) return null;
  const session = await sessionRepository.findSessionByActiveSesssionId(
    db,
    Number(payload.sid),
  );
  if (!session) return null;
  const user = await userRepository.findActiveUserById(db, Number(payload.sub));
  if (!user) return null;
  return { session: payload, token };
};

const endSessionService = async (
  c: Context,
  sessionID: SessionPayload["sid"],
): Promise<void> => {
  const db = getDb(c.env);
  await sessionRepository.deleteSessionBySesssionID(db, Number(sessionID));
};

/**
 * Quick check if session is valid
 */
export const isSessionValid = async (c: Context): Promise<boolean> => {
  const payload = await validateSessionService(c);
  return payload !== null;
};

/**
 * Extract user ID from token
 */
export const getUserIdFromToken = async (
  c: Context,
  token: string,
): Promise<string | null> => {
  try {
    const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
      getEnv(c);

    const sessionConfig = getSessionConfig(SESSION_SECRET, {
      days: SESSION_MAX_AGE_DAYS,
      hours: SESSION_MAX_AGE_HOURS,
    });

    const payload = await validateSessionToken(token, sessionConfig);
    return payload?.sub || null;
  } catch {
    return null;
  }
};

// ===== COOKIE + HEADER HELPERS =====

/**
 * Get session token from cookie
 */
export const getSessionFromCookie = (c: Context): string | null => {
  return getCookie(c, SESSION_COOKIE_NAME) || null;
};

/**
 * Get session token from Authorization header (Bearer token)
 */
export const getSessionFromHeader = (c: Context): string | null => {
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Get session token from cookie or header (cookie preferred)
 */
export const getSessionFromRequest = (c: Context): string | null => {
  return getSessionFromCookie(c) || getSessionFromHeader(c);
};

/**
 * Set session cookie in response
 */
export const setSessionCookie = async (
  c: Context,
  token: string,
  options?: {
    rememberMe?: boolean;
    domain?: string;
    secure?: boolean;
  },
): Promise<void> => {
  const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
    getEnv(c);

  const sessionConfig = getSessionConfig(SESSION_SECRET, {
    days: SESSION_MAX_AGE_DAYS,
    hours: SESSION_MAX_AGE_HOURS,
  });

  const maxAge = getSessionAge(sessionConfig.defaultTTL, options?.rememberMe);
  await setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: options?.secure ?? getEnv(c).NODE_ENV === "production",
    sameSite: "Strict",
    maxAge,
    domain: options?.domain,
    path: "/",
  });
};

/**
 * Clear session cookie
 */
export const clearSessionCookie = (
  c: Context,
  options?: { domain?: string },
) => {
  deleteCookie(c, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: getEnv(c).NODE_ENV === "production",
    sameSite: "Strict",
    domain: options?.domain,
    path: "/",
  });
};

/**
 * Validate session from request (cookie or header)
 */
export const validateRequestSession = async (
  c: Context,
): Promise<{ session: SessionPayload | null; token: string } | null> => {
  const token = getSessionFromRequest(c);
  if (!token) return null;
  const session = await validateSessionService(c);
  return session;
};

export default {
  createSession: createSessionService,
  validateSession: validateSessionService,
  endSession: endSessionService,
};
