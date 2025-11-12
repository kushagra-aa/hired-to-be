import { ApiError } from "@hiredtobe/shared/api";
import { RecruiterEntity } from "@hiredtobe/shared/entities";
import {
  RecruiterEditFormSchema,
  RecruiterEditFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import RecruiterForm from "@/client/components/forms/organization/RecruiterForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useUpdateRecruiter } from "@/client/hooks/useRecruiters";

function EditRecruiterDialog({
  rectuiter,
  onOpenChange,
  open,
  onSuccess,
}: {
  rectuiter: RecruiterEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const form = useForm<RecruiterEditFormType>({
    resolver: zodResolver(RecruiterEditFormSchema),
  });

  const submit = useUpdateRecruiter();

  const handleFormSubmit = (data: RecruiterEditFormType) => {
    if (!rectuiter) return;
    submit.mutate(
      {
        id: rectuiter.id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          linkedIn: data.linkedIn,
        },
      },
      {
        onSuccess: async () => {
          onSuccess!();
          toast.success("Recruiter Edited successfully");
          onOpenChange(false);
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

  useEffect(() => {
    if (rectuiter) {
      form.reset({
        name: rectuiter.name,
        email: rectuiter.email || undefined,
        phone: rectuiter.phone || undefined,
        linkedIn: rectuiter.linkedIn || undefined,
        orgID: rectuiter.orgID || undefined,
      });
    }
  }, [rectuiter, form]);

  if (!rectuiter) return;

  return (
    <UIDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Recruiter"
      description="Enter Recruiter Details"
      trigger={null}
      closeButton={
        <UIButton asChild className="mt-4 mb-10" variant="outline">
          <span>Cancel</span>
        </UIButton>
      }
    >
      <RecruiterForm
        mode="edit"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default EditRecruiterDialog;
