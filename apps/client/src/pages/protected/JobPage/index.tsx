import {
  JobDocumentEntity,
  JobEntity,
  JobFullEntity,
  RecruiterEntity,
} from "@hiredtobe/shared/entities";
import {
  Briefcase,
  Globe,
  Linkedin,
  LinkIcon,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import ConfirmDialog from "@/client/components/ConfirmDialog";
import AddJobDocDialog from "@/client/components/dialogs/job/AddJobDocDialog";
import EditJobDialog from "@/client/components/dialogs/job/EditJobDialog";
import AddRecruiterDialog from "@/client/components/dialogs/organization/AddRecriuterDialog";
import EditRecruiterDialog from "@/client/components/dialogs/organization/EditRecruiterDialog";
import { PageError } from "@/client/components/feedback/PageError";
import { PageLoader } from "@/client/components/feedback/PageLoader";
import UIButton from "@/client/components/ui/Button";
import { useDeleteJobDoc } from "@/client/hooks/useJobDocs";
import {
  JOB_KEY,
  useDeleteJob,
  useJobByID,
  useUpdateJobStatus,
} from "@/client/hooks/useJobs";
import { useModalManager } from "@/client/hooks/useModalManager";
import { useDeleteRecruiter } from "@/client/hooks/useRecruiters";
import { appQueryClient } from "@/client/lib/query-client";
import { cn } from "@/client/shadcn/lib/utils";
import { useAuth } from "@/client/stores/auth.store";
import { getJobCardBorder } from "@/client/utils/style.utils";

import JobStatusDropdown from "../JobsPage/JobStatusDropdown";
import RecruiterCard from "../OrganizationsPage/RecruiterCard";
import styles from "./index.module.css";

type JobDialogType =
  | "edit"
  | "delete"
  | "add_doc"
  | "delete_doc"
  | "add_recruiter"
  | "delete_recruiter"
  | "edit_recruiter";

export default function JobPage() {
  const { modal, openModal, closeModal, isOpen } = useModalManager<
    JobDialogType,
    JobFullEntity | JobDocumentEntity | RecruiterEntity
  >();

  const { id: jobID } = useParams();
  const naviagate = useNavigate();

  const { user } = useAuth();
  const jobQuery = useJobByID({
    id: jobID!,
    extend: ["organization", "recruiters", "documents"],
  });
  const job = jobQuery.data?.data;

  const del = useDeleteJob();
  const delDoc = useDeleteJobDoc({ jobID: job?.id || 0 });
  const delRecruiter = useDeleteRecruiter();
  const updateStatus = useUpdateJobStatus();
  const isActionLoading = del.isPending || updateStatus.isPending;
  const isRecruiterLoading = delRecruiter.isPending;

  // Mutation Handlers
  const handleDocDelete = async (id: number) => {
    closeModal();
    await delDoc.mutate(id);
  };
  const handleDelete = async (id: number) => {
    closeModal();
    await del.mutate(id);
    await naviagate(-1);
  };
  const handleRecruiterDelete = async (id: number) => {
    closeModal();
    await delRecruiter.mutate(id);
    onRecruiterModify();
  };

  const handleStatusChange = async (
    id: JobEntity["id"],
    status: JobEntity["status"],
  ) => {
    updateStatus.mutate({ id, status });
  };
  const onRecruiterModify = () => {
    void appQueryClient.invalidateQueries({
      queryKey: JOB_KEY(user?.id, jobID!),
    });
  };

  // Click handlers
  const handleDeleteClick = async (job: JobFullEntity) => {
    openModal("delete", job);
  };
  const handleDocDeleteClick = async (doc: JobDocumentEntity) => {
    openModal("delete_doc", doc);
  };
  const handleEditClick = async (job: JobFullEntity) => {
    openModal("edit", job);
  };
  const handleRecruiterDeleteClick = async (recruiter: RecruiterEntity) => {
    openModal("delete_recruiter", recruiter);
  };
  const handleRecruiterEditClick = async (recruiter: RecruiterEntity) => {
    openModal("edit_recruiter", recruiter);
  };

  const handleDeleteSubmit = async () => {
    if (!modal.data) return;
    if (isOpen("delete_recruiter")) await handleRecruiterDelete(modal.data.id);
    else if (isOpen("delete_doc")) await handleDocDelete(modal.data.id);
    else if (isOpen("delete")) await handleDelete(modal.data.id);
  };

  if (!jobID) return;
  if (jobQuery.isPending) return <PageLoader />;
  if (jobQuery.error || !jobQuery.data || !job)
    return (
      <PageError
        message={
          jobQuery.error?.data?.message ||
          jobQuery.error?.data?.error ||
          jobQuery.error?.message
        }
        mode="component"
      />
    );
  return (
    <>
      {/* Job Details Section */}
      <section className="flex flex-col gap-4">
        <div className="max-w-[100vw] flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl truncate">{job.title}</h1>
          <div className="flex gap-4">
            <UIButton
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isActionLoading}
              onClick={() => handleEditClick(job)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Job
            </UIButton>
            <UIButton
              variant="destructive"
              size="sm"
              className="flex-1"
              disabled={isActionLoading}
              onClick={() => handleDeleteClick(job)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Job
            </UIButton>
          </div>
        </div>
        <div className="max-w-[100vw] flex justify-between items-center flex-wrap gap-4">
          <p>
            <span className="font-bold">Location:</span> {job.location}
          </p>
          <p>
            <span className="font-bold">Expected Salary:</span>{" "}
            {job.expectedSalary}
          </p>
        </div>
        <div className="max-w-[100vw] flex justify-between items-center flex-wrap gap-4">
          <p>
            <span className="font-bold">Current Status:</span>{" "}
            <JobStatusDropdown
              job={job}
              updateStatus={handleStatusChange}
              color={getJobCardBorder(job.status)}
            />
          </p>
          <p>
            <span className="font-bold">Documents Linked:</span>{" "}
            {job.documents?.length ?? 0}
          </p>
        </div>
      </section>

      {/* Org | Docs | Recruiters Section */}
      <section className={styles.job_grid}>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl">
            <span className="font-bold">Organization Name:</span>{" "}
            {job.organization.name}
          </h2>
          <p>
            <span className="font-bold">Organization's Connections:</span>{" "}
            {job.organization?.recruiters?.length ?? 0}
          </p>
          <div className="flex gap-4">
            {job.organization?.website && (
              <a
                href={job.organization?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Website</span>
              </a>
            )}

            {job.organization?.linkedIn && (
              <a
                href={job.organization?.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">LinkedIn</span>
              </a>
            )}

            {job.organization?.careersURL && (
              <a
                href={job.organization?.careersURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
              >
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Careers</span>
              </a>
            )}

            {!job.organization?.website &&
              !job.organization?.linkedIn &&
              !job.organization?.careersURL && (
                <p className="text-sm text-slate-400 italic">
                  No links available
                </p>
              )}
          </div>
        </div>
        <aside
          className={cn(
            "row-span-4 flex flex-col gap-4",
            styles.docs_container,
          )}
        >
          <div className="flex justify-between">
            <h2 className="text-xl">Job Documents</h2>
            <UIButton
              className="rounded-full px-2!"
              onClick={() => openModal("add_doc", null)}
            >
              <PlusCircle className="h-6! w-6!" />
            </UIButton>
          </div>
          <div className="flex flex-col gap-2">
            {job.documents?.map((doc) => (
              <div key={doc.id} className="flex justify-between">
                <Link
                  to={doc.url}
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <LinkIcon className="h-5 w-5" /> {doc.type}
                </Link>
                <UIButton
                  variant="destructive"
                  size="sm"
                  className="w-min"
                  disabled={isActionLoading}
                  onClick={() => handleDocDeleteClick(doc)}
                >
                  <Trash2 className="h-4 w-4" />
                </UIButton>
              </div>
            ))}
          </div>
        </aside>
        <div className="row-span-3 flex flex-col gap-6">
          <div className="flex justify-between">
            <h2 className="text-xl">Organization Connections</h2>
            <UIButton
              className="rounded-full px-2!"
              onClick={() => openModal("add_recruiter", null)}
            >
              <PlusCircle className="h-6! w-6!" />
            </UIButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.organization.recruiters?.map((r) => (
              <RecruiterCard
                recruiter={r}
                handleDeleteClick={handleRecruiterDeleteClick}
                handleEditClick={handleRecruiterEditClick}
                isLoading={isRecruiterLoading}
                key={r.id}
              />
            ))}
          </div>
        </div>
      </section>

      <AddJobDocDialog
        jobID={job.id}
        open={isOpen("add_doc")}
        onOpenChange={(open) =>
          !open ? closeModal() : openModal("add_doc", null)
        }
      />
      <AddRecruiterDialog
        orgID={job.orgID}
        open={isOpen("add_recruiter")}
        onOpenChange={(open) =>
          !open ? closeModal() : openModal("add_recruiter", null)
        }
        onSuccess={onRecruiterModify}
      />
      <EditRecruiterDialog
        open={isOpen("edit_recruiter")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        rectuiter={modal.data as RecruiterEntity}
        onSuccess={onRecruiterModify}
      />
      <EditJobDialog
        open={isOpen("edit")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        job={modal.data as JobEntity}
      />
      <ConfirmDialog
        title="Are You Sure?"
        description={`Do you want to delete`}
        open={
          isOpen("delete") || isOpen("delete_doc") || isOpen("delete_recruiter")
        }
        onOpenChange={(open) => (!open ? closeModal() : null)}
        handleSubmit={handleDeleteSubmit}
        isLoading={del.isPending}
      />
    </>
  );
}
