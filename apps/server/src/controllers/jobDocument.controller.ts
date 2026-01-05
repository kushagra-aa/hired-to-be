import { Context } from "hono";

import { getDb } from "@/server/database";
import {
  sendAPIError,
  sendAPIResponse,
  sendValidationError,
} from "@/server/lib/response";
import jobDocumentService from "@/server/services/jobDocument.service";
import { DEFAULT_CURSOR_PAGINATION_CONFIG } from "@/server/utils/constants";
import { jobDocumentValidator } from "@/server/utils/validators/jobDocument.validator";

async function getJobDocumentsController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { id: jobID } = c.req.param();
  const cursor = c.req.query("cursor");
  const jobDocumentsResp = await jobDocumentService.getUserJobDocuments(
    db,
    Number(jobID),
    Number(userID),
    DEFAULT_CURSOR_PAGINATION_CONFIG.pageSize,
    cursor ? Number(cursor) : undefined,
  );

  if (jobDocumentsResp.error || !jobDocumentsResp.data)
    return sendAPIError(c, {
      error: jobDocumentsResp.error || "Failed to fetch jobDocuments",
      message: jobDocumentsResp.message || "Failed to fetch jobDocuments",
      status: jobDocumentsResp.status || 500,
    });

  return sendAPIResponse(c, {
    data: jobDocumentsResp.data,
    message: "JobDocuments Found Successfully",
    status: 200,
    cursorPagination: jobDocumentsResp.cursorPagination,
  });
}

async function addJobDocumentController(c: Context) {
  const db = getDb(c.env);
  const { id: jobID } = c.req.param();
  const { id: userID } = c.get("user");
  const body = await c.req.json();
  const validationResult = jobDocumentValidator.validateAdd(body || {});
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }
  const jobDocumentsResp = await jobDocumentService.addJobDocument(
    db,
    {
      ...validationResult.data!,
    },
    Number(jobID),
    Number(userID),
  );

  if (jobDocumentsResp.error || !jobDocumentsResp.data) {
    return sendAPIError(c, {
      error: jobDocumentsResp.error || "Failed to add jobDocument",
      errors: jobDocumentsResp.errors,
      message: jobDocumentsResp.message || "Failed to add jobDocument",
      status: jobDocumentsResp.status || 500,
    });
  }

  return sendAPIResponse(c, {
    data: jobDocumentsResp.data,
    message: "JobDocuments Added Successfully",
    status: 200,
    cursorPagination: jobDocumentsResp.cursorPagination,
  });
}

async function editJobDocumentController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { docID, id: jobID } = c.req.param();
  const body = await c.req.json();
  const validationResult = jobDocumentValidator.validateEdit(body);
  if (
    (!validationResult.isValid || !validationResult.data) &&
    validationResult.errors
  ) {
    return sendValidationError(c, validationResult.errors);
  }

  const jobDocumentsResp = await jobDocumentService.editJobDocument(
    db,
    Number(docID),
    {
      ...validationResult.data,
    },
    Number(jobID),
    Number(userID),
  );

  if (jobDocumentsResp.error || !jobDocumentsResp.data) {
    return sendAPIError(c, {
      error: jobDocumentsResp.error || "Failed to edit jobDocument",
      message: jobDocumentsResp.message || "Failed to edit jobDocument",
      status: jobDocumentsResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: jobDocumentsResp.data,
    message: "JobDocuments Edited Successfully",
    status: 200,
    cursorPagination: jobDocumentsResp.cursorPagination,
  });
}

async function deleteJobDocumentController(c: Context) {
  const db = getDb(c.env);
  const { id: userID } = c.get("user");
  const { docID, id: jobID } = c.req.param();
  const isSoftDelete = c.req.query("isSoftDelete");

  const jobDocumentsResp = await jobDocumentService.deleteJobDocument(
    db,
    Number(docID),
    Number(jobID),
    Number(userID),
    isSoftDelete === "true",
  );

  if (jobDocumentsResp.error || !jobDocumentsResp.data) {
    return sendAPIError(c, {
      error: jobDocumentsResp.error || "Failed to delete jobDocument",
      message: jobDocumentsResp.message || "Failed to delete jobDocument",
      status: jobDocumentsResp.status || 500,
    });
  }
  return sendAPIResponse(c, {
    data: jobDocumentsResp.data,
    message: "JobDocuments Deleted Successfully",
    status: 200,
    cursorPagination: jobDocumentsResp.cursorPagination,
  });
}

export default {
  getJobDocuments: getJobDocumentsController,
  addJobDocument: addJobDocumentController,
  editJobDocument: editJobDocumentController,
  deleteJobDocument: deleteJobDocumentController,
};
