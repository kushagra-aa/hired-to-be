import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@shared/lib/api/index.js";
import { LoginFormSchema, LoginFormType } from "@shared/schemas/auth.schema.js";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import { USER_LANDING_PAGES } from "@client/app/router.js";
import UIButton from "@client/components/ui/Button.js";
import UIFormWrapper from "@client/components/ui/FormWrapper.js";
import {
  FormControlType,
  UIInputField,
} from "@client/components/ui/InputField.js";
import Loader from "@client/components/ui/Loader.js";
import { makeToast } from "@client/components/ui/Toast.js";
import { useLogin } from "@client/hooks/useAuthActions.js";
import { Form } from "@client/shadcn/components/ui/form.js";
import { useAuth } from "@client/stores/auth.store.js";

export default function LoginPage() {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const login = useLogin();
  const { user } = useAuth();

  // If user was redirected from a protected route, go back there

  const handleFormSubmit = (data: LoginFormType) => {
    login.mutate(
      { email: data.email, googleID: data.googleID },
      {
        onSuccess: async () => {
          const from =
            (location.state as { from?: Location })?.from?.pathname ||
            USER_LANDING_PAGES[user!.role];
          makeToast.success("Logged in successfully");
          await navigate(from, { replace: true });
        },
        onError: (err: ApiError) => {
          form.setError("root", { message: err.data?.message || err.message });
        },
      },
    );
  };

  return (
    <main className="w-[100vw] min-h-[100vh] p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl">🔑 Login</h1>
      <Form {...form}>
        <UIFormWrapper
          error={form.formState.errors.root?.message}
          className="space-y-2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <UIInputField
            {...form.register("email")}
            control={form.control as unknown as FormControlType}
            label="Email"
            type="email"
            placeholder="Enter Email"
            icon={"X"}
            error={form.formState.errors?.email?.message}
          />
          <UIInputField
            {...form.register("googleID")} // Handles 'name', 'onChange', 'value'
            control={form.control as unknown as FormControlType}
            error={form.formState.errors?.googleID?.message}
            as="password"
            label="Google ID"
            placeholder="Enter Google ID"
          />
          <UIButton
            className="min-w-1/4"
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <Loader variant="clip" size={"xs"} color="secondary" />
            ) : (
              "Login"
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
        to="/register"
      >
        No Account? Register!
      </Link>
    </main>
  );
}
