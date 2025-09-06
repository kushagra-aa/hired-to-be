import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@shared/lib/api/index.js";
import { LoginFormSchema, LoginFormType } from "@shared/schemas/auth.schema.js";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import { USER_LANDING_PAGES } from "@client/app/router.js";
import Button from "@client/components/ui/Button/index.js";
import { Form } from "@client/components/ui/Form/index.js";
import { InputField } from "@client/components/ui/Form/Input/index.js";
import Loader from "@client/components/ui/Loader.js";
import { makeToast } from "@client/components/ui/Toast.js";
import { useLogin } from "@client/hooks/useAuthActions.js";
import { useAuth } from "@client/stores/auth.store.js";

export default function LoginPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const login = useLogin();
  const { user } = useAuth();

  // If user was redirected from a protected route, go back there

  const handleFormSubmit = (data: LoginFormType) => {
    login.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: async () => {
          const from =
            (location.state as { from?: Location })?.from?.pathname ||
            USER_LANDING_PAGES[user!.role];
          makeToast.success("Logged in successfully");
          await navigate(from, { replace: true });
        },
        onError: (err: ApiError) => {
          setError("root", { message: err.data?.message || err.message });
        },
      },
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>🔑 Login</h1>
      <Form
        error={errors.root?.message}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          icon={"X"}
          error={errors?.email?.message}
          {...formRegister("email")} // Handles 'name', 'onChange', 'value'
        />
        <InputField
          as="password"
          label="Password"
          placeholder="Enter Password"
          error={errors?.password?.message}
          {...formRegister("password")} // Handles 'name', 'onChange', 'value'
        />
        <Button type="submit" variant="primary" disabled={login.isPending}>
          {login.isPending ? (
            <Loader variant="clip" size={"xs"} color="secondary" />
          ) : (
            "Login"
          )}
        </Button>
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
    </div>
  );
}
