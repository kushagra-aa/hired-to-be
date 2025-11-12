import {
  OrganizationEntity,
  OrganizationFullEntity,
  RecruiterEntity,
} from "@hiredtobe/shared/entities";
import {
  Briefcase,
  Globe,
  Linkedin,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import ConfirmDialog from "@/client/components/ConfirmDialog";
import AddRecruiterDialog from "@/client/components/dialogs/organization/AddRecriuterDialog";
import EditOrganizationDialog from "@/client/components/dialogs/organization/EditOrganizationDialog";
import EditRecruiterDialog from "@/client/components/dialogs/organization/EditRecruiterDialog";
import { PageError } from "@/client/components/feedback/PageError";
import { PageLoader } from "@/client/components/feedback/PageLoader";
import UIButton from "@/client/components/ui/Button";
import { useModalManager } from "@/client/hooks/useModalManager";
import {
  ORGANIZATION_KEY,
  useDeleteOrganization,
  useOrganizationByID,
} from "@/client/hooks/useOrganizations";
import { useDeleteRecruiter } from "@/client/hooks/useRecruiters";
import { appQueryClient } from "@/client/lib/query-client";
import { useAuth } from "@/client/stores/auth.store";

import JobCard from "../JobsPage/JobCard";
import RecruiterCard from "../OrganizationsPage/RecruiterCard";

type OrgDialogType =
  | "edit"
  | "delete"
  | "add_recruiter"
  | "delete_recruiter"
  | "edit_recruiter";

function OrganizationPage() {
  const { modal, openModal, closeModal, isOpen } = useModalManager<
    OrgDialogType,
    OrganizationFullEntity | RecruiterEntity
  >();
  const { id: orgID } = useParams();
  const naviagate = useNavigate();

  const { user } = useAuth();
  const orgQuery = useOrganizationByID({
    id: orgID!,
    extend: ["recruiters", "jobs"],
  });
  const org = orgQuery.data?.data;

  const del = useDeleteOrganization();
  const delRecruiter = useDeleteRecruiter();
  const isActionLoading = del.isPending;
  const isRecruiterLoading = delRecruiter.isPending;

  const handleDelete = async (id: number) => {
    closeModal();
    await del.mutate(id);
    await naviagate(-1);
  };
  const handleRecruiterDelete = async (id: number) => {
    closeModal();
    await delRecruiter.mutate(id);
    await onRecruiterModify();
  };
  const onRecruiterModify = async () => {
    const key = ORGANIZATION_KEY(user?.id, orgID!);

    await appQueryClient.invalidateQueries({ queryKey: key });
    await appQueryClient.refetchQueries({ queryKey: key });
  };

  // Click Handlers
  const handleDeleteClick = async (org: OrganizationFullEntity) => {
    openModal("delete", org);
  };
  const handleEditClick = async (org: OrganizationFullEntity) => {
    openModal("edit", org);
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
    else if (isOpen("delete")) await handleDelete(modal.data.id);
  };

  if (!orgID) return;
  if (orgQuery.isPending) return <PageLoader />;
  if (orgQuery.error || !orgQuery.data || !org)
    return (
      <PageError
        message={
          orgQuery.error?.data?.message ||
          orgQuery.error?.data?.error ||
          orgQuery.error?.message
        }
        mode="component"
      />
    );
  return (
    <>
      {/* Job Details Section */}
      <section className="flex flex-col gap-4 mb-8">
        <div className="max-w-[100vw] flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl truncate">{org.name}</h1>
          <div className="flex gap-4 flex-wrap">
            <UIButton
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isActionLoading}
              onClick={() => handleEditClick(org)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Organization
            </UIButton>
            <UIButton
              variant="destructive"
              size="sm"
              className="flex-1"
              disabled={isActionLoading}
              onClick={() => handleDeleteClick(org)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Organization
            </UIButton>
          </div>
        </div>
        <div className="max-w-[100vw] flex justify-between items-center flex-wrap gap-4">
          <p>
            <span className="font-bold">Organization Jobs:</span>{" "}
            {org.jobs?.length ?? 0}
          </p>
          <p>
            <span className="font-bold">Organization Connections:</span>{" "}
            {org.recruiters?.length ?? 0}
          </p>
        </div>
        <div className="flex gap-4">
          {org?.website && (
            <a
              href={org?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Website</span>
            </a>
          )}

          {org?.linkedIn && (
            <a
              href={org?.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">LinkedIn</span>
            </a>
          )}

          {org?.careersURL && (
            <a
              href={org?.careersURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
            >
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Careers</span>
            </a>
          )}

          {!org?.website && !org?.linkedIn && !org?.careersURL && (
            <p className="text-sm text-slate-400 italic">No links available</p>
          )}
        </div>
      </section>

      {/* Jobs | Recruiters Section */}
      <section
        className={
          "flex flex-col lg:grid gap-8 lg:gap-1 bg-accent border border-accent"
        }
        style={{ gridTemplateColumns: "0.8fr 1fr", gridTemplateRows: "1fr" }}
      >
        <aside className={"row-span-4 flex flex-col gap-4 bg-background p-4"}>
          <div className="flex justify-between">
            <h2 className="text-xl">Jobs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 px-2">
            {org.jobs?.map((job) => (
              <JobCard
                isSmall
                key={job.id}
                job={{ ...job, organization: org, documents: [] }}
              />
            ))}
          </div>
        </aside>
        <div className="row-span-3 flex flex-col gap-6 bg-background p-4">
          <div className="flex justify-between">
            <h2 className="text-xl">Organization Connections</h2>
            <UIButton
              className="rounded-full px-2!"
              onClick={() => openModal("add_recruiter", null)}
            >
              <PlusCircle className="h-6! w-6!" />
            </UIButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
            {org.recruiters?.map((r) => (
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

      <AddRecruiterDialog
        orgID={org.id}
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
      <EditOrganizationDialog
        open={isOpen("edit")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        organization={modal.data as OrganizationEntity}
      />
      <ConfirmDialog
        title="Are You Sure?"
        description={`Do you want to delete`}
        open={isOpen("delete") || isOpen("delete_recruiter")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        handleSubmit={handleDeleteSubmit}
        isLoading={del.isPending}
      />
    </>
  );
}

export default OrganizationPage;
