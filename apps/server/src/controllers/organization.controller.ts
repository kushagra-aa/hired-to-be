import { Context } from "hono";

import { getDb } from "@/server/database";
import { sendAPIError, sendAPIResponse } from "@/server/lib/response";
import organizationService from "@/server/services/organization.service";

import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "../utils/constants";

async function getOrganizationsController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");

  const organizationsResp = await organizationService.getUserOrganizations(
    db,
    id,
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
  );

  if (organizationsResp.error || !organizationsResp.data)
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to fetch organizations",
      message: organizationsResp.message || "Failed to fetch organizations",
      status: organizationsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: organizationsResp.data,
    message: "Organizations Found Successfully",
    status: 200,
    cursorPagination: organizationsResp.cursorPagination,
  });
}

export default {
  getOrganizations: getOrganizationsController,
};
