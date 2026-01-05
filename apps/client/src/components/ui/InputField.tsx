import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";

import { Button } from "@/client/shadcn/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/shadcn/components/ui/form";
import { Input } from "@/client/shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/shadcn/components/ui/select";

type CommonPropsType = {
  label: string;
  name: string;
  as?: "input" | "password" | "select";
  options?: { label: string; value: string }[];
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
  required?: boolean;
  readOnly?: boolean;
};

export type FormControlType = Control<FieldValues, any, FieldValues>;
type InputPropsType = { field: ControllerRenderProps<FieldValues, string> };
type InputFieldPropsType = CommonPropsType & {
  control: FormControlType;
};

function SelectInput({
  field,
  options = [],
  placeholder,
}: InputPropsType & {
  options?: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
  required,
  readOnly,
  options,
}: InputFieldPropsType) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className={`${labelClassName}`} data-required={required}>
            {label}
          </FormLabel>
          <FormControl>
            {as === "password" ? (
              <PasswordInput field={field} placeholder={placeholder} />
            ) : as === "select" ? (
              <SelectInput
                field={field}
                options={options}
                placeholder={placeholder}
              />
            ) : (
              <Input
                className={`${inputClassName}`}
                placeholder={placeholder}
                type={type}
                required={required}
                readOnly={readOnly}
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
