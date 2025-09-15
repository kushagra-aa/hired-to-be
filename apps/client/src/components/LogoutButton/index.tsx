import UIButton from "@/client/components/ui/Button";
import Loader from "@/client/components/ui/Loader";
import { useLogout } from "@/client/hooks/useAuthActions";

import styles from "./index.module.css";

export function LogoutButton({ isFloating = false }: { isFloating?: boolean }) {
  const logout = useLogout();

  return (
    <div className={`${styles.container} ${isFloating && styles.floating}`}>
      <UIButton onClick={() => logout.mutate({})} disabled={logout.isPending}>
        {logout.isPending ? (
          <Loader variant="clip" size={"xs"} color="secondary" />
        ) : (
          "Logout"
        )}
      </UIButton>
    </div>
  );
}
