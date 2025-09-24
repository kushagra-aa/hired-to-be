import { Context } from "hono";

import { getDb } from "@/server/database";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@/server/lib/response";
import organizationService from "@/server/services/organization.service";
import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "@/server/utils/constants";
import { organizationValidator } from "@/server/utils/validators/organization.validator";

async function getOrganizationsController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");
  const cursor = c.req.query("cursor");

  const organizationsResp = await organizationService.getUserOrganizations(
    db,
    id,
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
    cursor ? Number(cursor) : undefined,
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

async function addOrganizationController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const body = await c.req.json();
  const validationResult = organizationValidator.validateAdd(body || {});
  if (
    !(validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  )
    return sendValidationError(c, validationResult.errors);

  const organizationsResp = await organizationService.addOrganization(db, {
    ...validationResult.data!,
    userID: Number(userID),
  });

  if (organizationsResp.error || !organizationsResp.data)
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to add organization",
      errors: organizationsResp.errors,
      message: organizationsResp.message || "Failed to add organization",
      status: organizationsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: organizationsResp.data,
    message: "Organizations Added Successfully",
    status: 200,
    cursorPagination: organizationsResp.cursorPagination,
  });
}

async function editOrganizationController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const body = await c.req.json();
  const validationResult = organizationValidator.validateAdd(body);
  if (!validationResult.isValid && validationResult.errors)
    return sendValidationError(c, validationResult.errors);

  const organizationsResp = await organizationService.editOrganization(
    db,
    Number(id),
    {
      ...validationResult.data,
    },
    Number(userID),
  );

  if (organizationsResp.error || !organizationsResp.data)
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to edit organization",
      message: organizationsResp.message || "Failed to edit organization",
      status: organizationsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: organizationsResp.data,
    message: "Organizations Edited Successfully",
    status: 200,
    cursorPagination: organizationsResp.cursorPagination,
  });
}

async function deleteOrganizationController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const isSoftDelete = c.req.query("isSoftDelete");

  const organizationsResp = await organizationService.deleteOrganization(
    db,
    Number(id),
    Number(userID),
    isSoftDelete === "true",
  );

  if (organizationsResp.error || !organizationsResp.data)
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to delete organization",
      message: organizationsResp.message || "Failed to delete organization",
      status: organizationsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: organizationsResp.data,
    message: "Organizations Deleted Successfully",
    status: 200,
    cursorPagination: organizationsResp.cursorPagination,
  });
}

export default {
  getOrganizations: getOrganizationsController,
  addOrganization: addOrganizationController,
  editOrganization: editOrganizationController,
  deleteOrganization: deleteOrganizationController,
};
