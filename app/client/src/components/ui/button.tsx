import {
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { Button } from "@client/shadcn/components/ui/button.js";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
};

function UIButton({
  children,
  onClick,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) onClick(e);
  };

  return (
    <Button
      className={`bg-${variant} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export default UIButton;
