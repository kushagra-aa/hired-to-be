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

import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import UIFormWrapper from "@/client/components/ui/FormWrapper";
import {
  FormControlType,
  UIInputField,
} from "@/client/components/ui/InputField";
import Loader from "@/client/components/ui/Loader";
import { useUpdateOrganization } from "@/client/hooks/useOrganizations";
import { Form } from "@/client/shadcn/components/ui/form";

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
          if (!errors) {
            form.setError("root", { message: err.message });
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
      title="Edit New Organization"
      description="Enter Organization Details"
      trigger={<UIButton variant="outline">Edit Organization</UIButton>}
      closeButton={
        <UIButton className="mt-4 mb-10" variant="outline">
          Cancel
        </UIButton>
      }
    >
      <Form {...form}>
        <UIFormWrapper
          className="space-y-2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 self-center flex flex-col items-center"
          onSubmit={form.handleSubmit(handleFormSubmit)}
          error={form.formState.errors.root?.message}
        >
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Name"
            placeholder="Enter Org Name"
            error={form.formState.errors?.name?.message}
            className="w-full"
            required
            {...form.register("name")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Org Website"
            placeholder="Enter Org Website"
            error={form.formState.errors?.website?.message}
            className="w-full"
            {...form.register("website")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Org LinkedIn URL"
            placeholder="Enter Org LinkedIn URL"
            error={form.formState.errors?.linkedIn?.message}
            className="w-full"
            {...form.register("linkedIn")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Org Careers URL"
            placeholder="Enter Org Careers URL"
            error={form.formState.errors?.careersURL?.message}
            className="w-full"
            {...form.register("careersURL")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Org Logo URL"
            placeholder="Enter Org Logo URL"
            error={form.formState.errors?.logoURL?.message}
            className="w-full"
            {...form.register("logoURL")}
          />
          <UIButton type="submit" disabled={submit.isPending}>
            {submit.isPending ? (
              <Loader variant="clip" size={"xs"} color="secondary" />
            ) : (
              "Save Organization"
            )}
          </UIButton>
        </UIFormWrapper>
      </Form>
    </UIDrawer>
  );
}

export default EditOrganizationDialog;
