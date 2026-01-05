import { Hono } from "hono";

import jobDocumentController from "@/server/controllers/jobDocument.controller";
import { withAuthMiddlewares } from "@/server/middlewares";

export const jobDocumentsRoutes = new Hono();

// All /entities require session
jobDocumentsRoutes.use("/*", ...withAuthMiddlewares()); // use this approach for 'global' application of middleware

jobDocumentsRoutes.get("", jobDocumentController.getJobDocuments);
jobDocumentsRoutes.post("", jobDocumentController.addJobDocument);

jobDocumentsRoutes.patch("/:docID", jobDocumentController.editJobDocument);
jobDocumentsRoutes.delete("/:docID", jobDocumentController.deleteJobDocument);
