import {
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { Button, VariantsType } from "@client/shadcn/components/ui/button.js";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: VariantsType["variant"];
  size?: VariantsType["size"];
};

function UIButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) onClick(e);
  };

  return (
    <Button
      className={`${className}`}
      variant={variant}
      size={size}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export default UIButton;
