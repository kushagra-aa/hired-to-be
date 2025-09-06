import type { FormHTMLAttributes } from "react";

import styles from "./index.module.css";

type FormProps = {
  error?: string;
  errorClassName?: string;
} & FormHTMLAttributes<HTMLFormElement>;

export function Form({ children, error, errorClassName, ...props }: FormProps) {
  return (
    <form className={styles.form} {...props}>
      {children}
      {error && (
        <p className={`${errorClassName} ${styles.form_error}`}>{error}</p>
      )}
    </form>
  );
}
