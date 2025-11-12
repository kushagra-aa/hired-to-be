import { ApiError } from "@hiredtobe/shared/api";
import { JobEntity } from "@hiredtobe/shared/entities";
import {
  JobDocumentAddFormSchema,
  JobDocumentAddFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import JobDocForm from "@/client/components/forms/job/JobDocForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useAddJobDoc } from "@/client/hooks/useJobDocs";

function AddJobDocDialog({
  jobID,
  onOpenChange,
  open,
}: {
  jobID: JobEntity["id"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<JobDocumentAddFormType>({
    resolver: zodResolver(JobDocumentAddFormSchema),
  });

  const submit = useAddJobDoc({ jobID });

  const handleFormSubmit = (data: JobDocumentAddFormType) => {
    if (!jobID) return;
    submit.mutate(
      {
        type: data.type,
        url: data.url,
      },
      {
        onSuccess: async () => {
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

  if (!jobID) return;

  return (
    <UIDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit New Job"
      description="Enter Job Details"
      trigger={null}
      closeButton={
        <UIButton asChild className="mt-4 mb-10" variant="outline">
          <span>Cancel</span>
        </UIButton>
      }
    >
      <JobDocForm
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default AddJobDocDialog;
