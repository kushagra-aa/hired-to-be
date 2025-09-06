import { FormHTMLAttributes } from "react";

type FormProps = {
  error?: string;
  errorClassName?: string;
} & FormHTMLAttributes<HTMLFormElement>;

function UIFormWrapper({
  children,
  error,
  errorClassName,
  ...props
}: FormProps) {
  return (
    <form {...props}>
      {children}
      {error && <p className={`${errorClassName} text-danger`}>{error}</p>}
    </form>
  );
}

export default UIFormWrapper;
