import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import styles from "./index.module.css";
import PasswordInput, { PasswordInputPropsType } from "./PasswordInput.js";

type CommonPropsType = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  iconClassName?: string;
};

type SelectPropsType = SelectHTMLAttributes<HTMLSelectElement> & {
  optionClassName?: string;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
};

type InputFieldPropsType =
  | (CommonPropsType & InputHTMLAttributes<HTMLInputElement> & { as?: "input" })
  | (CommonPropsType &
      TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" })
  | (CommonPropsType & SelectPropsType & { as: "select" })
  | (CommonPropsType & PasswordInputPropsType & { as: "password" });

const InputComponents = {
  input: (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`${props.className} ${styles.input_field}`} />
  ),
  password: (props: InputHTMLAttributes<HTMLInputElement>) => (
    <PasswordInput
      {...props}
      className={`${props.className} ${styles.input_field}`}
    />
  ),
  textarea: (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className={`${props.className} ${styles.textarea_field}`}
    />
  ),
  select: ({
    options,
    optionClassName,
    placeholder,
    ...props
  }: SelectPropsType) => (
    <select {...props} className={`${props.className} ${styles.select_field}`}>
      {placeholder && (
        <option selected disabled value="">
          {placeholder}
        </option>
      )}
      {options?.map((option) => (
        <option
          key={option.value}
          className={`${optionClassName} ${styles.select_option}`}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  ),
};

export function InputField({
  as = "input",
  name: htmlName,
  label,
  error,
  hint,
  icon,
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  iconClassName,
  ...props
}: InputFieldPropsType) {
  const Component = InputComponents[as] as unknown as React.FC<{
    name: string;
    className: string;
  }>; // TS still needs a cast here

  return (
    <div className={className}>
      <label
        htmlFor={htmlName}
        className={`${labelClassName} ${styles.input_label}`}
      >
        {label}
      </label>

      {icon && (
        <div className={`${iconClassName} ${styles.input_icon}`}>{icon}</div>
      )}

      <Component
        {...props}
        name={htmlName}
        className={`${inputClassName} ${error && styles.error} ${styles.input_base}`}
      />

      {error && (
        <p className={`${errorClassName} ${styles.input_error}`}>{error}</p>
      )}
      {hint && (
        <p className={`${hintClassName} ${styles.input_hint}`}>{hint}</p>
      )}
    </div>
  );
}
