import { JobEntity, JobFullEntity } from "@hiredtobe/shared/entities";

import ConfirmDialog from "@/client/components/ConfirmDialog";
import AddJobDialog from "@/client/components/dialogs/job/AddJobDialog";
import EditJobDialog from "@/client/components/dialogs/job/EditJobDialog";
import UIButton from "@/client/components/ui/Button";
import { UIEmpty } from "@/client/components/ui/Empty";
import Loader from "@/client/components/ui/Loader";
import {
  useDeleteJob,
  useJobs,
  useUpdateJobStatus,
} from "@/client/hooks/useJobs";
import { useModalManager } from "@/client/hooks/useModalManager";

import JobCard from "./JobCard";

type JobDialogType = "edit" | "delete" | "add";

export default function JobsPage() {
  const { modal, openModal, closeModal, isOpen } = useModalManager<
    JobDialogType,
    JobFullEntity
  >();
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useJobs();
  const del = useDeleteJob();
  const updateStatus = useUpdateJobStatus();

  const jobs = data?.pages.flatMap((page) => page.data) ?? [];

  const handleDelete = async (id: number) => {
    closeModal();
    await del.mutate(id);
  };
  const handleDeleteClick = async (job: JobFullEntity) => {
    openModal("delete", job);
  };
  const handleEditClick = async (job: JobFullEntity) => {
    openModal("edit", job);
  };
  const handleStatusChange = async (
    id: JobEntity["id"],
    status: JobEntity["status"],
  ) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div>
      <div className="flex gap-4 sm:justify-between flex-col sm:flex-row">
        <h1 className="text-2xl text-center">Jobs</h1>
        <AddJobDialog
          open={isOpen("add")}
          onOpenChange={(open) =>
            !open ? closeModal() : openModal("add", null)
          }
        />
      </div>
      <div className="py-4">
        {!isPending &&
          (!jobs ||
            (jobs.length <= 0 && (
              <UIEmpty
                title="No Jobs Yet"
                description="You haven't created any jobs yet. Get started by
          creating your first project."
              />
            )))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        {isPending && (
          <div className="col-span-4 flex items-center justify-center">
            <Loader variant="clip" size="2xl" />
          </div>
        )}
        {jobs.map((o) => (
          <JobCard
            key={o.id}
            job={o}
            handleDeleteClick={handleDeleteClick}
            handleEditClick={handleEditClick}
            handleStatusChange={handleStatusChange}
            isLoading={del.isPending || updateStatus.isPending}
          />
        ))}
      </div>
      {!isPending && hasNextPage && (
        <div className="w-full grid place-items-center">
          <UIButton onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? <Loader variant="clip" /> : "Load More"}
          </UIButton>
        </div>
      )}

      <EditJobDialog
        open={isOpen("edit")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        job={modal.data}
      />
      <ConfirmDialog
        title="Are You Sure?"
        description="Do you want to delete this Job"
        open={isOpen("delete")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        handleSubmit={() => modal.data && handleDelete(modal.data.id)}
        isLoading={del.isPending}
      />
    </div>
  );
}
