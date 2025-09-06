import { SessionPayload } from "@shared/types/common.types.js";
import { sign, verify } from "hono/jwt";

/**
 * Create a JWT from a session payload.
 */
export const encrypt = async (
  payload: SessionPayload,
  secret: string,
): Promise<string> => {
  // hono/jwt.sign does not auto-handle exp/iat, so we include them in payload
  return await sign(payload, secret, "HS256");
};

/**
 * Verify and decode a JWT.
 */
export const decrypt = async (
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> => {
  if (!token) return null;
  try {
    const payload = (await verify(token, secret, "HS256")) as SessionPayload;
    return payload;
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
};
