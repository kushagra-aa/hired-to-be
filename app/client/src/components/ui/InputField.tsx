import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";

import { Button } from "@client/shadcn/components/ui/button.js";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/shadcn/components/ui/form.js";
import { Input } from "@client/shadcn/components/ui/input.js";

type CommonPropsType = {
  label: string;
  name: string;
  as?: "input" | "password";
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  error?: string;
  hint?: string;
  icon?: ReactNode;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  iconClassName?: string;
};

export type FormControlType = Control<FieldValues, any, FieldValues>;
type InputPropsType = { field: ControllerRenderProps<FieldValues, string> };
type InputFieldPropsType = CommonPropsType & {
  control: FormControlType;
};

function PasswordInput({
  field,
  inputClassName,
  placeholder,
}: InputPropsType & { inputClassName?: string; placeholder?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`relative`}>
      <Input
        className={`${inputClassName} pr-11`}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        {...field}
      />
      <Button
        onClick={() => setShowPassword((s) => !s)}
        type="button"
        className={`absolute top-0 right-0 rounded-l-none`}
        title={showPassword ? "Hide Password" : "Show Password"}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

export function UIInputField({
  control,
  name,
  as = "input",
  type = "text",
  label,
  hint,
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  placeholder,
}: InputFieldPropsType) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className={`${labelClassName}`}>{label}</FormLabel>
          <FormControl>
            {as === "password" ? (
              <PasswordInput field={field} placeholder={placeholder} />
            ) : (
              <Input
                className={`${inputClassName}`}
                placeholder={placeholder}
                type={type}
                {...field}
              />
            )}
          </FormControl>
          <FormDescription className={`${hintClassName}`}>
            {hint}
          </FormDescription>
          <FormMessage className={`${errorClassName}`} />
        </FormItem>
      )}
    />
  );
}
