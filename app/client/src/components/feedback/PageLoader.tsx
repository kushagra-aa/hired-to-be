import Loader from "@client/components/ui/Loader.js";

import styles from "./index.module.css";

export function PageLoader() {
  return (
    <div className={styles.container}>
      <Loader variant="clip" size="2xl" color="primary" />
    </div>
  );
}
