import { ApiError } from "@hiredtobe/shared/api";
import { JobEntity } from "@hiredtobe/shared/entities";
import { JobEditFormSchema, JobEditFormType } from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import JobDocForm from "@/client/components/forms/job/JobForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useUpdateJob } from "@/client/hooks/useJobs";

function EditJobDialog({
  job,
  onOpenChange,
  open,
}: {
  job: JobEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<JobEditFormType>({
    resolver: zodResolver(JobEditFormSchema),
  });

  const submit = useUpdateJob();

  const handleFormSubmit = (data: JobEditFormType) => {
    if (!job) return;
    submit.mutate(
      {
        id: job.id,
        data: {
          title: data.title,
          location: data.location,
          expectedSalary: data.expectedSalary,
          jdLink: data.jdLink,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Job Edited successfully");
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
    if (job) {
      form.reset({
        title: job.title || undefined,
        location: job.location || undefined,
        expectedSalary: job.expectedSalary || undefined,
        jdLink: job.jdLink || undefined,
      });
    }
  }, [job, form]);

  if (!job) return;

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
        mode="edit"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default EditJobDialog;
