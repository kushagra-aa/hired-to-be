import { ApiError } from "@hiredtobe/shared/api";
import { OrganizationEntity } from "@hiredtobe/shared/entities";
import {
  OrganizationEditFormSchema,
  OrganizationEditFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import OrganizationForm from "@/client/components/forms/organization/OrganizationForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useUpdateOrganization } from "@/client/hooks/useOrganizations";

function EditOrganizationDialog({
  organization,
  onOpenChange,
  open,
}: {
  organization: OrganizationEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<OrganizationEditFormType>({
    resolver: zodResolver(OrganizationEditFormSchema),
  });

  const submit = useUpdateOrganization();

  const handleFormSubmit = (data: OrganizationEditFormType) => {
    if (!organization) return;
    submit.mutate(
      {
        id: organization.id,
        data: {
          name: data.name,
          website: data.website,
          linkedIn: data.linkedIn,
          careersURL: data.careersURL,
          logoURL: data.logoURL,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Org Edited successfully");
          onOpenChange(false);
        },
        onError: (err: ApiError) => {
          const errors = err.data?.errors || [];
          if (!errors || errors.length <= 0) {
            form.setError("root", {
              message: err.data.message || err.data.error || err.message,
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

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        website: organization.website || undefined,
        linkedIn: organization.linkedIn || undefined,
        careersURL: organization.careersURL || undefined,
        logoURL: organization.logoURL || undefined,
      });
    }
  }, [organization, form]);

  if (!organization) return;

  return (
    <UIDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Organization"
      description="Enter Organization Details"
      trigger={null}
      closeButton={
        <UIButton className="mt-4 mb-10" variant="outline">
          Cancel
        </UIButton>
      }
    >
      <OrganizationForm
        mode="edit"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default EditOrganizationDialog;
