import { SessionPayload } from "@shared/types/common.types.js";
import {
  UserRoleEnum,
  UserSessionType,
} from "@shared/types/entities/user.entity.js";
import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { getEnv } from "@server/config/env.js";
import {
  createSessionToken,
  getSessionAge,
  getSessionConfig,
  validateSessionToken,
} from "@server/lib/session.js";
import { SESSION_COOKIE_NAME } from "@server/utils/constants.js";

/**
 * Create a new session token for a user
 */
const createSessionService = async (
  c: Context,
  userID: UserSessionType["googleID"],
  role: UserRoleEnum,
  options?: {
    rememberMe?: boolean;
    deviceInfo?: string;
  },
): Promise<string> => {
  const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
    getEnv(c);

  const sessionConfig = getSessionConfig(SESSION_SECRET, {
    days: SESSION_MAX_AGE_DAYS,
    hours: SESSION_MAX_AGE_HOURS,
  });

  const now = Math.floor(Date.now());
  const expiresIn = getSessionAge(
    sessionConfig.defaultTTL,
    options?.rememberMe,
  );

  const payload: SessionPayload = {
    id: String(userID),
    role,
    iat: now / 1000,
    exp: now / 1000 + expiresIn, // in seconds
    // sessionId: crypto.randomUUID(), // optional for stateful sessions
    // deviceInfo: options?.deviceInfo,
  };

  return await createSessionToken(payload, sessionConfig);
};

/**
 * Validate a session token and return payload
 */
const validateSessionService = async (
  c: Context,
  token: string,
): Promise<SessionPayload | null> => {
  const { SESSION_SECRET, SESSION_MAX_AGE_DAYS, SESSION_MAX_AGE_HOURS } =
    getEnv(c);

  const sessionConfig = getSessionConfig(SESSION_SECRET, {
    days: SESSION_MAX_AGE_DAYS,
    hours: SESSION_MAX_AGE_HOURS,
  });

  if (!token) return null;

  const payload = await validateSessionToken(token, sessionConfig);
  if (!payload) return null;

  // TODO: Add business validations (user active, permissions, etc.)
  return payload;
};

/**
 * Quick check if session is valid
 */
export const isSessionValid = async (
  c: Context,
  token: string,
): Promise<boolean> => {
  const payload = await validateSessionService(c, token);
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
    return payload?.id || null;
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
  const session = await validateSessionService(c, token);
  return { session, token };
};

export default {
  createSession: createSessionService,
  validateSession: validateSessionService,
};
