import { SessionConfigType, SessionPayload } from "@hiredtobe/shared/types";

import { decrypt, encrypt } from "./jwt";

// Session configuration
export const getSessionConfig = (
  secret: string,
  ttl: { days: number; hours: number },
): SessionConfigType => ({
  secretKey: secret,
  defaultTTL:
    (ttl.days || 1) *
    (ttl.days === 1 ? 24 + ttl.hours : ttl.hours) *
    60 *
    60 *
    1000, // days * hours in milliseconds
});

export const getSessionAge = (defaultTTL: number, rememberMe?: boolean) =>
  rememberMe
    ? 30 * 24 * 60 * 60 // 30 days in seconds
    : defaultTTL / 1000;

export const createSessionToken = async (
  payload: SessionPayload,
  sessionConfig: SessionConfigType,
): Promise<string> => {
  // Generate stateless JWT token
  const token = await encrypt(payload, sessionConfig.secretKey);

  // TODO: For stateful sessions, store session in Redis/DB:
  // await sessionStateService.storeSession(payload.sessionId, {
  //   userId: payload.userId,
  //   role: payload.role,
  //   createdAt: Date.now(),
  //   lastAccessed: Date.now(),
  //   deviceInfo: payload.deviceInfo
  // });

  return token;
};

/**
 * Validate and decode stateless session token
 */
export const validateSessionToken = async (
  token: string,
  sessionConfig: Omit<SessionConfigType, "days" | "hours">,
): Promise<SessionPayload | null> => {
  try {
    // Decrypt and validate JWT token (stateless)
    const payload = await decrypt(token, sessionConfig.secretKey);

    if (!payload) {
      return null;
    }

    // TODO: For stateful sessions, check server-side storage:
    // const sessionData = await sessionStateService.getSession(payload.sessionId);
    // if (!sessionData || sessionData.isRevoked) {
    //   return null; // Session was manually revoked
    // }
    //
    // // Update last accessed time
    // await sessionStateService.updateLastAccessed(payload.sessionId);

    return payload as SessionPayload;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
};
