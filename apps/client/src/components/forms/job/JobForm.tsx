import {
  JobAddFormClientType,
  JobEditFormType,
} from "@hiredtobe/shared/schemas";
import { UseFormReturn } from "react-hook-form";

import UIButton from "@/client/components/ui/Button";
import UIFormWrapper from "@/client/components/ui/FormWrapper";
import {
  FormControlType,
  UIInputField,
} from "@/client/components/ui/InputField";
import Loader from "@/client/components/ui/Loader";
import { Form } from "@/client/shadcn/components/ui/form";

type JobFormPropsType<T extends "add" | "edit"> = {
  mode: T;
  form: UseFormReturn<T extends "add" ? JobAddFormClientType : JobEditFormType>;
  onSubmit: (
    data: T extends "add" ? JobAddFormClientType : JobEditFormType,
  ) => void;
  isLoading?: boolean;
  isAddOrg?: boolean;
  setIsAddOrg?: React.Dispatch<React.SetStateAction<boolean>>;
  organizationOptions?: T extends "add"
    ? { label: string; value: string }[]
    : undefined;
};

function JobForm<T extends "add" | "edit">({
  mode,
  form,
  onSubmit,
  isLoading,
  organizationOptions,
  isAddOrg,
  setIsAddOrg,
}: JobFormPropsType<T>) {
  const castedForm = form as unknown as UseFormReturn<JobAddFormClientType>;
  const castedSubmit = onSubmit as unknown as (
    data: JobAddFormClientType,
  ) => void;

  return (
    <Form {...castedForm}>
      <UIFormWrapper
        className="space-y-2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 self-center flex flex-col items-center"
        onSubmit={castedForm.handleSubmit(castedSubmit)}
        error={castedForm.formState.errors.root?.message}
      >
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Job Title"
          placeholder="Enter Job Title"
          error={castedForm.formState.errors?.title?.message}
          className="w-full"
          required
          {...castedForm.register("title")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Job Location"
          placeholder="Enter Job Location"
          error={castedForm.formState.errors?.location?.message}
          className="w-full"
          required
          {...castedForm.register("location")}
        />
        <div className="w-full flex gap-4 justify-between">
          {mode === "add" &&
            (isAddOrg ? (
              <UIInputField
                control={castedForm.control as unknown as FormControlType}
                label="Organization Name"
                placeholder="Enter New Organization Name"
                error={castedForm.formState.errors?.orgName?.message}
                className="w-full"
                required
                {...castedForm.register("orgName")}
              />
            ) : (
              <UIInputField
                as="select"
                options={organizationOptions}
                control={castedForm.control as unknown as FormControlType}
                label="Organization"
                placeholder="Select Organization"
                type="number"
                error={castedForm.formState.errors?.orgID?.message}
                className="w-full"
                required
                {...castedForm.register("orgID")}
              />
            ))}
          <UIButton
            variant="outline"
            className="h-[inherit]"
            title={!isAddOrg ? "Add New Org" : "Swtich to Searching Org"}
            onClick={() => setIsAddOrg!((v) => !v)}
          >
            {!isAddOrg ? "New Org+" : "Select Org"}
          </UIButton>
        </div>
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Job Link"
          placeholder="Enter Job Link"
          error={castedForm.formState.errors?.jdLink?.message}
          className="w-full"
          required
          {...castedForm.register("jdLink")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Epected Salary"
          placeholder="Enter Asked Epected Salary"
          type="number"
          error={castedForm.formState.errors?.expectedSalary?.message}
          className="w-full"
          required
          {...castedForm.register("expectedSalary", { valueAsNumber: true })}
        />
        <UIButton className="w-max" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="p-8">
              <Loader variant="clip" size={"xs"} color="secondary" />
            </span>
          ) : (
            "Save Job"
          )}
        </UIButton>
      </UIFormWrapper>
    </Form>
  );
}

export default JobForm;
