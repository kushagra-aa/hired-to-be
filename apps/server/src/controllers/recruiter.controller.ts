import { parseJsonParam } from "@hiredtobe/shared/utils";
import { Context } from "hono";
import z from "zod";

import { getDb } from "@/server/database";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@/server/lib/response";
import recruiterService, {
  GetRecruiterExtendType,
} from "@/server/services/recruiter.service";
import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "@/server/utils/constants";
import { recruiterValidator } from "@/server/utils/validators/recruiter.validator";

const recruiterExtendParamSchema = z.array(
  z.union([z.literal("organization"), z.literal("job"), z.literal("user")]),
);

async function getRecruitersController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");
  const cursor = c.req.query("cursor");
  const extend = parseJsonParam<GetRecruiterExtendType>(
    c.req.queries("extend"),
    recruiterExtendParamSchema,
  );
  const recruitersResp = await recruiterService.getUserRecruiters(
    db,
    id,
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
    cursor ? Number(cursor) : undefined,
    extend,
  );

  if (recruitersResp.error || !recruitersResp.data)
    return sendAPIError(c, {
      error: recruitersResp.error || "Failed to fetch recruiters",
      message: recruitersResp.message || "Failed to fetch recruiters",
      status: recruitersResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: recruitersResp.data,
    message: "Recruiters Found Successfully",
    status: 200,
    cursorPagination: recruitersResp.cursorPagination,
  });
}

async function addRecruiterController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const body = await c.req.json();
  const validationResult = recruiterValidator.validateAdd(body || {});
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }
  const recruitersResp = await recruiterService.addRecruiter(
    db,
    {
      ...validationResult.data!,
    },
    Number(userID),
  );

  if (recruitersResp.error || !recruitersResp.data) {
    return sendAPIError(c, {
      error: recruitersResp.error || "Failed to add recruiter",
      errors: recruitersResp.errors,
      message: recruitersResp.message || "Failed to add recruiter",
      status: recruitersResp.status || 500,
    });
  }

  return sendAPIResponse(c, {
    data: recruitersResp.data,
    message: "Recruiters Added Successfully",
    status: 200,
    cursorPagination: recruitersResp.cursorPagination,
  });
}

async function editRecruiterController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const body = await c.req.json();
  const validationResult = recruiterValidator.validateEdit(body);
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }

  const recruitersResp = await recruiterService.editRecruiter(
    db,
    Number(id),
    {
      ...validationResult.data,
    },
    Number(userID),
  );

  if (recruitersResp.error || !recruitersResp.data) {
    return sendAPIError(c, {
      error: recruitersResp.error || "Failed to edit recruiter",
      message: recruitersResp.message || "Failed to edit recruiter",
      status: recruitersResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: recruitersResp.data,
    message: "Recruiters Edited Successfully",
    status: 200,
    cursorPagination: recruitersResp.cursorPagination,
  });
}

async function deleteRecruiterController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const isSoftDelete = c.req.query("isSoftDelete");

  const recruitersResp = await recruiterService.deleteRecruiter(
    db,
    Number(id),
    Number(userID),
    isSoftDelete === "true",
  );

  if (recruitersResp.error || !recruitersResp.data) {
    return sendAPIError(c, {
      error: recruitersResp.error || "Failed to delete recruiter",
      message: recruitersResp.message || "Failed to delete recruiter",
      status: recruitersResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: recruitersResp.data,
    message: "Recruiters Deleted Successfully",
    status: 200,
    cursorPagination: recruitersResp.cursorPagination,
  });
}

export default {
  getRecruiters: getRecruitersController,
  addRecruiter: addRecruiterController,
  editRecruiter: editRecruiterController,
  deleteRecruiter: deleteRecruiterController,
};
