import { ApiError } from "@hiredtobe/shared/api";
import {
  OrganizationAddFormSchema,
  OrganizationAddFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAddOrganization } from "@/client/hooks/useOrganizations";
import { Form } from "@/client/shadcn/components/ui/form";
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
      <Form {...form}>
        <UIFormWrapper
          className="space-y-2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 self-center flex flex-col items-center"
          onSubmit={form.handleSubmit(handleFormSubmit)}
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

export default AddOrganizationDialog;
