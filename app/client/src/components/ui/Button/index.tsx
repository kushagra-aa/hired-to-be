import {
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";

import styles from "./index.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  isFill?: boolean;
};

function Button({
  children,
  onClick,
  variant = "primary",
  isFill = false,
  ...props
}: ButtonProps) {
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${isFill && styles.fill}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
