import { ApiError } from "@hiredtobe/shared/lib";
import {
  RegisterFormSchema,
  RegisterFormType,
} from "@hiredtobe/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { USER_LANDING_PAGES } from "@/client/app/router";
import UIButton from "@/client/components/ui/Button";
import UIFormWrapper from "@/client/components/ui/FormWrapper";
import {
  FormControlType,
  UIInputField,
} from "@/client/components/ui/InputField";
import Loader from "@/client/components/ui/Loader";
import { useRegister } from "@/client/hooks/useAuthActions";
import { Form } from "@/client/shadcn/components/ui/form";

export default function RegisterPage() {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const register = useRegister();

  const handleFormSubmit = (data: RegisterFormType) => {
    register.mutate(
      {
        fullName: data.fullName || "",
        email: data.email,
        googleID: data.googleID,
      },
      {
        onSuccess: async () => {
          const from =
            (location.state as { from?: Location })?.from?.pathname ||
            USER_LANDING_PAGES["USER"];
          toast.success("Registered successfully");
          await navigate(from, { replace: true });
        },
        onError: (err: ApiError) => {
          const errors = err.data?.errors || [];
          if (!errors) {
            form.setError("root", { message: err.message });
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
    <main className="w-[100vw] min-h-[100vh] p-10 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">📝 Register</h1>
      <Form {...form}>
        <UIFormWrapper
          className="space-y-2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Full Name"
            placeholder="Enter Full Name"
            error={form.formState.errors?.fullName?.message}
            {...form.register("fullName")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            label="Email"
            type="email"
            placeholder="Enter Email"
            error={form.formState.errors?.email?.message}
            {...form.register("email")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            as="password"
            label="Password"
            placeholder="Enter Password"
            error={form.formState.errors?.googleID?.message}
            {...form.register("googleID")}
          />
          <UIInputField
            control={form.control as unknown as FormControlType}
            as="password"
            label="Confirm Password"
            placeholder="Enter Password"
            error={form.formState.errors?.confirm_googleID?.message}
            {...form.register("confirm_googleID")}
          />
          <UIButton type="submit" disabled={register.isPending}>
            {register.isPending ? (
              <Loader variant="clip" size={"xs"} color="secondary" />
            ) : (
              "Register"
            )}
          </UIButton>
        </UIFormWrapper>
      </Form>
      <Link
        style={{
          display: "inline-block",
          marginTop: "1rem",
          color: "var(--color-primary)",
        }}
        to="/login"
      >
        Have an Account? Login!
      </Link>
    </main>
  );
}
