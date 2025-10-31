import {
  OrganizationAddFormType,
  OrganizationEditFormType,
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

type OrganizationFormPropsType<T extends "add" | "edit"> = {
  mode: T;
  form: UseFormReturn<
    T extends "add" ? OrganizationAddFormType : OrganizationEditFormType
  >;
  onSubmit: (
    data: T extends "add" ? OrganizationAddFormType : OrganizationEditFormType,
  ) => void;
  isLoading?: boolean;
};

function OrganizationForm<T extends "add" | "edit">({
  form,
  onSubmit,
  isLoading,
}: OrganizationFormPropsType<T>) {
  const castedForm = form as unknown as UseFormReturn<OrganizationEditFormType>;
  const castedSubmit = onSubmit as unknown as (
    data: OrganizationEditFormType,
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
          placeholder="Enter Org Name"
          error={castedForm.formState.errors?.name?.message}
          className="w-full"
          required
          {...castedForm.register("name")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Org Website"
          placeholder="Enter Org Website"
          error={castedForm.formState.errors?.website?.message}
          className="w-full"
          {...castedForm.register("website")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Org LinkedIn URL"
          placeholder="Enter Org LinkedIn URL"
          error={castedForm.formState.errors?.linkedIn?.message}
          className="w-full"
          {...castedForm.register("linkedIn")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Org Careers URL"
          placeholder="Enter Org Careers URL"
          error={castedForm.formState.errors?.careersURL?.message}
          className="w-full"
          {...castedForm.register("careersURL")}
        />
        <UIInputField
          control={castedForm.control as unknown as FormControlType}
          label="Org Logo URL"
          placeholder="Enter Org Logo URL"
          error={castedForm.formState.errors?.logoURL?.message}
          className="w-full"
          {...castedForm.register("logoURL")}
        />
        <UIButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader variant="clip" size={"xs"} color="secondary" />
          ) : (
            "Save Organization"
          )}
        </UIButton>
      </UIFormWrapper>
    </Form>
  );
}

export default OrganizationForm;
