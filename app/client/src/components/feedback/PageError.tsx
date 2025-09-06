import UIButton from "../ui/Button.js";
import styles from "./index.module.css";

type PageErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function PageError({
  message = "Something went wrong.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚠️ Oops!</h1>
      <p className={styles.message}>{message}</p>
      {onRetry && <UIButton onClick={onRetry}>Retry</UIButton>}
    </div>
  );
}
