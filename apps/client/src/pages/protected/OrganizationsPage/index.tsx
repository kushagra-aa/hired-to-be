import { OrganizationEntity } from "@hiredtobe/shared/entities";

import ConfirmDialog from "@/client/components/ConfirmDialog";
import AddOrganizationDialog from "@/client/components/dialogs/organization/AddOrganizationDialog";
import EditOrganizationDialog from "@/client/components/dialogs/organization/EditOrganizationDialog";
import UIButton from "@/client/components/ui/Button";
import { UIEmpty } from "@/client/components/ui/Empty";
import Loader from "@/client/components/ui/Loader";
import { useModalManager } from "@/client/hooks/useModalManager";
import {
  useDeleteOrganization,
  useOrganizations,
} from "@/client/hooks/useOrganizations";

import OrganizationCard from "./OrganizationCard";

type OrgDialogType = "edit" | "delete";

export default function OrganizationsPage() {
  const { modal, openModal, closeModal, isOpen } = useModalManager<
    OrgDialogType,
    OrganizationEntity
  >();
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useOrganizations();
  const del = useDeleteOrganization();

  const organizations = data?.pages.flatMap((page) => page.data) ?? [];

  const handleDelete = async (id: number) => {
    closeModal();
    await del.mutate(id);
  };
  const handleDeleteClick = async (org: OrganizationEntity) => {
    openModal("delete", org);
  };
  const handleEditClick = async (org: OrganizationEntity) => {
    openModal("edit", org);
  };

  return (
    <div>
      <div className="flex gap-4 sm:justify-between flex-col sm:flex-row">
        <h1 className="text-2xl text-center">Organizations</h1>
        <AddOrganizationDialog />
      </div>
      <div className="py-4">
        {!isPending &&
          (!organizations ||
            (organizations.length <= 0 && (
              <UIEmpty
                title="No Organizations Yet"
                description="You haven't created any organizations yet. Get started by
          creating your first project."
              />
            )))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
        {isPending && (
          <div className="col-span-4 flex items-center justify-center">
            <Loader variant="clip" size="2xl" />
          </div>
        )}
        {organizations.map((o) => (
          <OrganizationCard
            key={o.id}
            organization={o}
            handleDeleteClick={handleDeleteClick}
            handleEditClick={handleEditClick}
            isLoading={del.isPending}
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

      <EditOrganizationDialog
        open={isOpen("edit")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        organization={modal.data}
      />
      <ConfirmDialog
        title="Are You Sure?"
        description="Do you want to delete this Organization"
        open={isOpen("delete")}
        onOpenChange={(open) => (!open ? closeModal() : null)}
        handleSubmit={() => modal.data && handleDelete(modal.data.id)}
        isLoading={del.isPending}
      />
    </div>
  );
}
