import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@shared/lib/api/index.js";
import {
  RegisterFormSchema,
  RegisterFormType,
} from "@shared/schemas/auth.schema.js";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { USER_LANDING_PAGES } from "@client/app/router.js";
import Button from "@client/components/ui/Button/index.js";
import { Form } from "@client/components/ui/Form/index.js";
import { InputField } from "@client/components/ui/Form/Input/index.js";
import Loader from "@client/components/ui/Loader.js";
import { useRegister } from "@client/hooks/useAuthActions.js";

export default function RegisterPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormType>({ resolver: zodResolver(RegisterFormSchema) });

  const navigate = useNavigate();
  const location = useLocation();

  const register = useRegister();

  const handleFormSubmit = (data: RegisterFormType) => {
    register.mutate(
      {
        full_name: data.full_name || "",
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
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
            setError("root", { message: err.message });
          }
          const errorFields = Object.entries(errors);
          errorFields.forEach(([field, error]) => {
            setError(field as "root", {
              message: error[0] || "Something Is Wrong",
            });
          });
        },
      },
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>📝 Register</h1>
      <Form
        error={errors.root?.message}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <InputField
          label="Full Name"
          placeholder="Enter Full Name"
          error={errors?.full_name?.message}
          {...formRegister("full_name")}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          error={errors?.email?.message}
          {...formRegister("email")}
        />
        <InputField
          as="password"
          label="Password"
          placeholder="Enter Password"
          error={errors?.password?.message}
          {...formRegister("password")}
        />
        <InputField
          as="password"
          label="Confirm Password"
          placeholder="Enter Password"
          error={errors?.confirm_password?.message}
          {...formRegister("confirm_password")}
        />
        <Button type="submit" variant="primary" disabled={register.isPending}>
          {register.isPending ? (
            <Loader variant="clip" size={"xs"} color="secondary" />
          ) : (
            "Register"
          )}
        </Button>
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
    </div>
  );
}
