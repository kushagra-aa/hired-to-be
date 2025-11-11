import UIButton from "@/client/components/ui/Button";
import { cn } from "@/client/shadcn/lib/utils";

import styles from "./index.module.css";

type PageErrorProps = {
  message?: string;
  onRetry?: () => void;
  mode?: "component";
};

export function PageError({
  message = "Something went wrong.",
  onRetry,
  mode,
}: PageErrorProps) {
  return (
    <div
      className={cn(styles.container, mode === "component" && styles.component)}
    >
      <h1 className={styles.title}>⚠️ Oops!</h1>
      <p className={styles.message}>{message}</p>
      {onRetry && <UIButton onClick={onRetry}>Retry</UIButton>}
    </div>
  );
}
