import { ApiError } from "@hiredtobe/shared/api";
import { JobEntity } from "@hiredtobe/shared/entities";
import {
  RecruiterAddFormSchema,
  RecruiterAddFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import RecruiterForm from "@/client/components/forms/organization/RecruiterForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useAddRecruiter } from "@/client/hooks/useRecruiters";

function AddRecruiterDialog({
  orgID,
  onOpenChange,
  open,
  onSuccess,
}: {
  orgID: JobEntity["id"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const form = useForm<RecruiterAddFormType>({
    resolver: zodResolver(RecruiterAddFormSchema),
  });

  const submit = useAddRecruiter();

  const handleFormSubmit = (data: RecruiterAddFormType) => {
    if (!orgID) return;
    submit.mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        linkedIn: data.linkedIn,
        orgID: data.orgID,
      },
      {
        onSuccess: async () => {
          onSuccess!();
          toast.success("Doc Added successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (err: ApiError) => {
          const errors = err.data?.errors || [];
          if (!errors) {
            form.setError("root", { message: err.data?.error || err.message });
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
    if (orgID) {
      form.reset({
        orgID: Number(orgID),
      });
    }
  }, [orgID, form]);

  if (!orgID) return;

  return (
    <UIDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit New Job"
      description="Enter Job Details"
      trigger={null}
      closeButton={
        <UIButton className="mt-4 mb-10" variant="outline">
          Cancel
        </UIButton>
      }
    >
      <RecruiterForm
        mode="add"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default AddRecruiterDialog;
