import { parseJsonParam } from "@hiredtobe/shared/utils";
import { Context } from "hono";
import z from "zod";

import { getDb } from "@/server/database";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@/server/lib/response";
import organizationService, {
  GetOrganizationExtendType,
} from "@/server/services/organization.service";
import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "@/server/utils/constants";
import { organizationValidator } from "@/server/utils/validators/organization.validator";

const organizationExtendParamSchema = z.array(
  z.union([z.literal("recruiters"), z.literal("jobs")]),
);

async function getOrganizationsController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");
  const cursor = c.req.query("cursor");
  const extend = parseJsonParam<GetOrganizationExtendType>(
    c.req.queries("extend"),
    organizationExtendParamSchema,
  );

  const organizationsResp = await organizationService.getUserOrganizations(
    db,
    id,
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
    cursor ? Number(cursor) : undefined,
    extend,
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

async function getOrganizationController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.req.param();
  const { id: userID } = c.get("user");
  const extend = parseJsonParam<GetOrganizationExtendType>(
    c.req.queries("extend"),
    organizationExtendParamSchema,
  );

  const organizationsResp = await organizationService.getUserOrganizationByID(
    db,
    Number(id),
    userID,
    extend,
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

async function getOrganizationsAsOptionsController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");

  const organizationsResp =
    await organizationService.getUserOrganizationsAsOptions(db, id);

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
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }

  const organizationsResp = await organizationService.addOrganization(db, {
    ...validationResult.data!,
    userID: Number(userID),
  });

  if (organizationsResp.error || !organizationsResp.data) {
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to add organization",
      errors: organizationsResp.errors,
      message: organizationsResp.message || "Failed to add organization",
      status: organizationsResp.status || 500,
    });
  }

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
  const validationResult = organizationValidator.validateEdit(body);
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }
  const organizationsResp = await organizationService.editOrganization(
    db,
    Number(id),
    {
      ...validationResult.data,
    },
    Number(userID),
  );

  if (organizationsResp.error || !organizationsResp.data) {
    return sendAPIError(c, {
      error: organizationsResp.error || "Failed to edit organization",
      message: organizationsResp.message || "Failed to edit organization",
      status: organizationsResp.status || 500,
    });
  }

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
  getOrganization: getOrganizationController,
  addOrganization: addOrganizationController,
  getOrganizationsAsOptions: getOrganizationsAsOptionsController,
  editOrganization: editOrganizationController,
  deleteOrganization: deleteOrganizationController,
};
