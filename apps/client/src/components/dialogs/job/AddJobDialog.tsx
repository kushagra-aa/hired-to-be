import { ApiError } from "@hiredtobe/shared/api";
import { JobStatusEnum } from "@hiredtobe/shared/entities";
import { JobAddFormSchema, JobAddFormType } from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import JobForm from "@/client/components/forms/job/JobForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useAddJob } from "@/client/hooks/useJobs";
import { useAuth } from "@/client/stores/auth.store";

function AddJobDialog() {
  const { user } = useAuth();

  const form = useForm<JobAddFormType>({
    resolver: zodResolver(JobAddFormSchema),
  });

  const submit = useAddJob();

  const handleFormSubmit = (data: JobAddFormType) => {
    submit.mutate(
      {
        title: data.title,
        location: data.location,
        expectedSalary: data.expectedSalary,
        jdLink: data.jdLink,
        orgID: data.orgID,
        status: JobStatusEnum.accepted,
        userID: user!.id,
      },
      {
        onSuccess: async () => {
          toast.success("Job Added successfully");
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

  return (
    <UIDrawer
      title="Add New Job"
      description="Enter Job Details"
      trigger={<UIButton variant="outline">Add Job</UIButton>}
      closeButton={
        <UIButton className="mt-4 mb-10" variant="outline">
          Cancel
        </UIButton>
      }
    >
      <JobForm
        mode="add"
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={submit.isPending}
      />
    </UIDrawer>
  );
}

export default AddJobDialog;
