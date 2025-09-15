import { useNavigate } from "react-router";

import UIButton from "@/client/components/ui/Button";

import styles from "./index.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page not found</p>
      <UIButton onClick={() => navigate("/")}>Go Home</UIButton>
    </div>
  );
}
