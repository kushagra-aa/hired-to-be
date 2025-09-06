import { useNavigate } from "react-router";

import Button from "@client/components/ui/Button/index.js";

import styles from "./index.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page not found</p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
}
