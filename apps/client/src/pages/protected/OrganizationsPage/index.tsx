import { OrganizationEntity } from "@hiredtobe/shared/entities";
import { useState } from "react";

import ConfirmDialog from "@/client/components/ConfirmDialog";
import AddOrganizationDialog from "@/client/components/forms/AddOrganizationDialog";
import EditOrganizationDialog from "@/client/components/forms/EditOrganizationDialog";
import UIButton from "@/client/components/ui/Button";
import { UIEmpty } from "@/client/components/ui/Empty";
import Loader from "@/client/components/ui/Loader";
import {
  useDeleteOrganization,
  useOrganizations,
} from "@/client/hooks/useOrganizations";

import OrganizationCard from "./OrganizationCard";

export default function OrganizationsPage() {
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationEntity | null>(null);
  const [dialogState, setDialogState] = useState<null | "eidt" | "delete">(
    null,
  );

  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useOrganizations();
  const del = useDeleteOrganization();

  const organizations = data?.pages.flatMap((page) => page.data) ?? [];

  const handleDelete = async (id: number) => {
    setDialogState(null);
    setSelectedOrganization(null);
    await del.mutate(id);
  };
  const handleDeleteClick = async (org: OrganizationEntity) => {
    setDialogState("delete");
    setSelectedOrganization(org);
  };
  const handleEditClick = async (org: OrganizationEntity) => {
    setDialogState("eidt");
    setSelectedOrganization(org);
  };

  return (
    <div>
      <EditOrganizationDialog
        open={dialogState === "eidt" && !!selectedOrganization}
        onOpenChange={(open) => (!open ? setSelectedOrganization(null) : null)}
        organization={selectedOrganization}
      />
      <ConfirmDialog
        title="Are You Sure?"
        description="Do you want to delete this Organization"
        open={dialogState === "delete" && !!selectedOrganization}
        onOpenChange={(open) => (!open ? setSelectedOrganization(null) : null)}
        handleSubmit={() =>
          selectedOrganization && handleDelete(selectedOrganization.id)
        }
        isLoading={del.isPending}
      />
      {/* Install and Add An Modal Component */}
      <div className="flex gap-4 sm:justify-between flex-col sm:flex-row">
        <h1 className="text-2xl text-center">Organizations</h1>
        <AddOrganizationDialog />
      </div>
      <div className="py-4">
        {!organizations ||
          (organizations.length <= 0 && (
            <UIEmpty
              title="No Organizations Yet"
              description="You haven't created any organizations yet. Get started by
          creating your first project."
            />
          ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
        {isPending && <Loader variant="clip" />}
        {organizations.map((o) => (
          <OrganizationCard
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
    </div>
  );
}
