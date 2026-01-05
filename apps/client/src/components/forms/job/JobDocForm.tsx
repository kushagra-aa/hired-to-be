import { JobDocumentAddFormType } from "@hiredtobe/shared/schemas";
import { UseFormReturn } from "react-hook-form";

import UIButton from "@/client/components/ui/Button";
import UIFormWrapper from "@/client/components/ui/FormWrapper";
import {
  FormControlType,
  UIInputField,
} from "@/client/components/ui/InputField";
import Loader from "@/client/components/ui/Loader";
import { Form } from "@/client/shadcn/components/ui/form";

type JobDocFormPropsType = {
  // mode: T;
  form: UseFormReturn<JobDocumentAddFormType>;
  onSubmit: (data: JobDocumentAddFormType) => void;
  isLoading?: boolean;
};

function JobDocForm({
  // mode,
  form,
  onSubmit,
  isLoading,
}: JobDocFormPropsType) {
  const castedForm = form as unknown as UseFormReturn<JobDocumentAddFormType>;
  const castedSubmit = onSubmit as unknown as (
    data: JobDocumentAddFormType,
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
          label="Doc Type"
          placeholder="Enter Doc Type"
          error={castedForm.formState.errors?.type?.message}
          className="w-full"
          required
          {...castedForm.register("type")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Doc URL"
          placeholder="Enter Doc URL"
          error={castedForm.formState.errors?.url?.message}
          className="w-full"
          {...castedForm.register("url")}
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

export default JobDocForm;
