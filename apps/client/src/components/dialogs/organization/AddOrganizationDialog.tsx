import { ApiError } from "@hiredtobe/shared/api";
import {
  OrganizationAddFormSchema,
  OrganizationAddFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import OrganizationForm from "@/client/components/forms/organization/OrganizationForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useAddOrganization } from "@/client/hooks/useOrganizations";
import { useAuth } from "@/client/stores/auth.store";

function AddOrganizationDialog() {
  const { user } = useAuth();

  const form = useForm<OrganizationAddFormType>({
    resolver: zodResolver(OrganizationAddFormSchema),
  });

  const submit = useAddOrganization();

  const handleFormSubmit = (data: OrganizationAddFormType) => {
    submit.mutate(
      {
        name: data.name,
        website: data.website,
        linkedIn: data.linkedIn,
        careersURL: data.careersURL,
        logoURL: data.logoURL,
        userID: user!.id,
      },
      {
        onSuccess: async () => {
          toast.success("Org Added successfully");
        },
        onError: (err: ApiError) => {
          const errors = err.data?.errors || [];
          if (!errors) {
            form.setError("root", {
              message: err.data?.message || err.data?.error || err.message,
            });
          }
          const errorFields = Object.entries(errors);
          errorFields.forEach(([field, error]) => {
            form.setError(field as "root", {
              message: (error as Array<string>)[0] || "Something Is Wrong",
            });
          });
        },
      },
    );
  };

  return (
    <UIDrawer
      title="Add New Organization"
      description="Enter Organization Details"
      trigger={<UIButton variant="outline">Add Organization</UIButton>}
      closeButton={
        <UIButton className="mt-4 mb-10" variant="outline">
          Cancel
        </UIButton>
      }
    >
      <OrganizationForm
        mode="add"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default AddOrganizationDialog;
