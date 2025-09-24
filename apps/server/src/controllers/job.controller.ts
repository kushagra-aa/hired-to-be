import { JobStatusEnum } from "@hiredtobe/shared/entities";
import { parseJsonParam } from "@hiredtobe/shared/utils";
import { Context } from "hono";
import z from "zod";

import { getDb } from "@/server/database";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@/server/lib/response";
import jobService, { GetJobExtendType } from "@/server/services/job.service";
import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "@/server/utils/constants";
import { jobValidator } from "@/server/utils/validators/job.validator";

const jobExtendParamSchema = z.array(
  z.union([
    z.literal("user"),
    z.literal("organization"),
    z.literal("recruiters"),
    z.literal("interviews"),
    z.literal("documents"),
  ]),
);

async function getJobsController(c: Context) {
  const db = getDb(c.env);

  const { id } = c.get("user");
  const cursor = c.req.query("cursor");
  const extend = parseJsonParam<GetJobExtendType>(
    c.req.queries("extend"),
    jobExtendParamSchema,
  );
  const jobsResp = await jobService.getUserJobs(
    db,
    id,
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
    cursor ? Number(cursor) : undefined,
    extend,
  );

  if (jobsResp.error || !jobsResp.data)
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to fetch jobs",
      message: jobsResp.message || "Failed to fetch jobs",
      status: jobsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Found Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

async function getJobController(c: Context) {
  const db = getDb(c.env);
  const { id } = c.req.param();
  const { id: userID } = c.get("user");
  const extendArr = c.req.queries("extend");
  const extend = parseJsonParam<GetJobExtendType>(
    extendArr,
    jobExtendParamSchema,
  );

  const jobsResp = await jobService.getUserJob(db, userID, Number(id), extend);

  if (jobsResp.error || !jobsResp.data)
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to fetch jobs",
      message: jobsResp.message || "Failed to fetch jobs",
      status: jobsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Found Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

async function addJobController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const body = await c.req.json();
  const validationResult = jobValidator.validateAdd(body || {});
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }
  const jobsResp = await jobService.addJob(db, {
    ...validationResult.data!,
    userID: Number(userID),
    status: JobStatusEnum.applied,
  });

  if (jobsResp.error || !jobsResp.data) {
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to add job",
      errors: jobsResp.errors,
      message: jobsResp.message || "Failed to add job",
      status: jobsResp.status || 500,
    });
  }

  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Added Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

async function editJobController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const body = await c.req.json();
  const validationResult = jobValidator.validateEdit(body);
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }

  const jobsResp = await jobService.editJob(
    db,
    Number(id),
    {
      ...validationResult.data,
    },
    Number(userID),
  );

  if (jobsResp.error || !jobsResp.data) {
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to edit job",
      message: jobsResp.message || "Failed to edit job",
      status: jobsResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Edited Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

async function editJobStatusController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const body = await c.req.json();
  const validationResult = jobValidator.validateEditStatus(body);
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }

  const jobsResp = await jobService.editJob(
    db,
    Number(id),
    {
      ...validationResult.data,
    },
    Number(userID),
  );

  if (jobsResp.error || !jobsResp.data) {
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to edit job",
      message: jobsResp.message || "Failed to edit job",
      status: jobsResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Edited Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

async function deleteJobController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id } = c.req.param();
  const isSoftDelete = c.req.query("isSoftDelete");

  const jobsResp = await jobService.deleteJob(
    db,
    Number(id),
    Number(userID),
    isSoftDelete === "true",
  );

  if (jobsResp.error || !jobsResp.data) {
    return sendAPIError(c, {
      error: jobsResp.error || "Failed to delete job",
      message: jobsResp.message || "Failed to delete job",
      status: jobsResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: jobsResp.data,
    message: "Jobs Deleted Successfully",
    status: 200,
    cursorPagination: jobsResp.cursorPagination,
  });
}

export default {
  getJobs: getJobsController,
  addJob: addJobController,
  editJob: editJobController,
  editJobStatus: editJobStatusController,
  deleteJob: deleteJobController,
  getJob: getJobController,
};
