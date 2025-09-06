import { useState, type InputHTMLAttributes } from "react";

import styles from "./index.module.css";

export type PasswordInputPropsType = InputHTMLAttributes<HTMLInputElement>;

function PasswordInput({ ...props }: PasswordInputPropsType) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles.password_input_container}>
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${props.className} ${styles.input_field}`}
      />
      <button
        onClick={() => setShowPassword((s) => !s)}
        type="button"
        className={styles.password_input_icon}
        title={showPassword ? "Hide Password" : "Show Password"}
      >
        {showPassword ? "H" : "S"}
      </button>
    </div>
  );
}

export default PasswordInput;
