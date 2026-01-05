import {
  RecruiterAddFormType,
  RecruiterEditFormType,
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

type RecruiterFormPropsType<T extends "add" | "edit"> = {
  mode: T;
  form: UseFormReturn<
    T extends "add" ? RecruiterAddFormType : RecruiterEditFormType
  >;
  onSubmit: (
    data: T extends "add" ? RecruiterAddFormType : RecruiterEditFormType,
  ) => void;
  isLoading?: boolean;
};

function RecruiterForm<T extends "add" | "edit">({
  mode,
  form,
  onSubmit,
  isLoading,
}: RecruiterFormPropsType<T>) {
  const castedForm = form as unknown as UseFormReturn<RecruiterEditFormType>;
  const castedSubmit = onSubmit as unknown as (
    data: RecruiterEditFormType,
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
          label="Name"
          placeholder="Enter Connection Name"
          error={castedForm.formState.errors?.name?.message}
          className="w-full"
          required
          {...castedForm.register("name")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Email"
          placeholder="Enter Connection Email"
          error={castedForm.formState.errors?.email?.message}
          className="w-full"
          required
          {...castedForm.register("email")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Phone No."
          placeholder="Enter Connection Phone"
          error={castedForm.formState.errors?.phone?.message}
          className="w-full"
          {...castedForm.register("phone")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="LinkedIn Profile"
          placeholder="Enter LinkedIn Profile"
          error={castedForm.formState.errors?.linkedIn?.message}
          className="w-full"
          {...castedForm.register("linkedIn")}
        />
        {mode === "add" && (
          <UIInputField
            control={castedForm.control as unknown as FormControlType}
            label="Organization"
            placeholder="Enter Connection Organization"
            error={castedForm.formState.errors?.orgID?.message}
            className="w-full"
            required
            {...castedForm.register("orgID")}
          />
        )}
        <UIButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader variant="clip" size={"xs"} color="secondary" />
          ) : (
            "Save Recruiter"
          )}
        </UIButton>
      </UIFormWrapper>
    </Form>
  );
}

export default RecruiterForm;
