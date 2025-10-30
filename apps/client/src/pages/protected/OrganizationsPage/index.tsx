import AddOrganizationDialog from "@/client/components/forms/AddOrganizationDialog";
import { UIEmpty } from "@/client/components/ui/Empty";
import {
  useDeleteOrganization,
  useOrganizations,
} from "@/client/hooks/useOrganizations";

import OrganizationCard from "./OrganizationCard";

export default function OrganizationsPage() {
  const { data: organizations } = useOrganizations();

  const del = useDeleteOrganization();

  const handleDeleteClick = async (id: number) => {
    await del.mutate(id);
  };
  return (
    <div>
      {/* Install and Add An Modal Component */}
      <div className="flex justify-between">
        <h1 className="text-2xl">Organizations</h1>
        <AddOrganizationDialog />
      </div>
      <div className="py-4">
        {!organizations ||
          (organizations.data?.length <= 0 && (
            <UIEmpty
              title="No Organizations Yet"
              description="You haven't created any organizations yet. Get started by
          creating your first project."
            />
          ))}
      </div>
      <div className="grid grid-cols-4 gap-4 py-4">
        {organizations?.data.map((o) => (
          <OrganizationCard
            organization={o}
            handleDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
    </div>
  );
}
