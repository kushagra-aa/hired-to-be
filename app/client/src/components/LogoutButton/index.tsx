import Button from "@client/components/ui/Button/index.js";
import Loader from "@client/components/ui/Loader.js";
import { useLogout } from "@client/hooks/useAuthActions.js";

import styles from "./index.module.css";

export function LogoutButton({ isFloating = false }: { isFloating?: boolean }) {
  const logout = useLogout();

  return (
    <div className={`${styles.container} ${isFloating && styles.floating}`}>
      <Button
        variant="danger"
        onClick={() => logout.mutate({})}
        disabled={logout.isPending}
        isFill={!isFloating}
      >
        {logout.isPending ? (
          <Loader variant="clip" size={"xs"} color="secondary" />
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}
