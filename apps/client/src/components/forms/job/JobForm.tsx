import { JobAddFormType, JobEditFormType } from "@hiredtobe/shared/schemas";
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
  form: UseFormReturn<T extends "add" ? JobAddFormType : JobEditFormType>;
  onSubmit: (data: T extends "add" ? JobAddFormType : JobEditFormType) => void;
  isLoading?: boolean;
};

function JobForm<T extends "add" | "edit">({
  mode,
  form,
  onSubmit,
  isLoading,
}: JobFormPropsType<T>) {
  const castedForm = form as unknown as UseFormReturn<JobAddFormType>;
  const castedSubmit = onSubmit as unknown as (data: JobAddFormType) => void;

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
        {mode === "add" && (
          <UIInputField
            control={castedForm.control as unknown as FormControlType}
            label="Organization"
            placeholder="Select Organization"
            type="number"
            error={castedForm.formState.errors?.orgID?.message}
            className="w-full"
            required
            {...castedForm.register("orgID")}
          />
        )}
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
        <UIButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader variant="clip" size={"xs"} color="secondary" />
          ) : (
            "Save Job"
          )}
        </UIButton>
      </UIFormWrapper>
    </Form>
  );
}

export default JobForm;
