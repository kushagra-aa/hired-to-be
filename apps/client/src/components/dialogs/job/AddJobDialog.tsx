import { ApiError } from "@hiredtobe/shared/api";
import {
  JobAddFormClientSchema,
  JobAddFormClientType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import JobForm from "@/client/components/forms/job/JobForm";
import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";
import { useAddJob } from "@/client/hooks/useJobs";
import {
  useAddOrganization,
  useOrganizationsAsOptions,
} from "@/client/hooks/useOrganizations";
import { useAuth } from "@/client/stores/auth.store";

function AddJobDialog() {
  const [isAddOrg, setIsAddOrg] = useState(false);
  const { user } = useAuth();

  const orgOptionsResp = useOrganizationsAsOptions();

  const form = useForm<JobAddFormClientType>({
    resolver: zodResolver(JobAddFormClientSchema),
  });

  const addJob = useAddJob();
  const addOrg = useAddOrganization();

  const handleAddJob = async (data: JobAddFormClientType) => {
    addJob.mutate(
      {
        title: data.title,
        location: data.location,
        expectedSalary: data.expectedSalary,
        jdLink: data.jdLink,
        orgID: data.orgID!,
        userID: user!.id,
      },
      {
        onSuccess: async () => {
          toast.success("Job Added successfully");
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

  const handleFormSubmit = async (data: JobAddFormClientType) => {
    const payload = data;
    if (isAddOrg)
      addOrg.mutate(
        { name: data.orgName!, userID: user!.id },
        {
          onSuccess: async (data) => {
            const orgID = data?.data?.id;
            if (!orgID) throw new Error("Error while creating Organization");
            await handleAddJob({ ...payload, orgID });
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
              form.setError(field === "name" ? "orgName" : (field as "root"), {
                message: (error as Array<string>)[0] || "Something Is Wrong",
              });
            });
          },
        },
      );
    // else await handleAddJob(data);
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
        organizationOptions={orgOptionsResp.data?.data || []}
        onSubmit={handleFormSubmit}
        isAddOrg={isAddOrg}
        setIsAddOrg={setIsAddOrg}
        isLoading={addJob.isPending || orgOptionsResp.isPending}
      />
    </UIDrawer>
  );
}

export default AddJobDialog;
