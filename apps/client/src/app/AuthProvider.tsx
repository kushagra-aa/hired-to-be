import { useEffect, type ReactNode } from "react";

import { PageLoader } from "@/client/components/feedback/PageLoader";
import { useSession } from "@/client/hooks/useSession";
import { useAuth } from "@/client/stores/auth.store";

function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userResp, isLoading } = useSession();
  const { setUser, logout } = useAuth();

  // Sync TanStack Query result into Zustand
  useEffect(() => {
    if (userResp && userResp.data) {
      setUser(userResp.data.user, String(userResp.data.token)); // Will populate with actual Auth Token
    } else {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userResp, setUser]);

  if (isLoading) return <PageLoader />;
  return <>{children}</>;
}

export default AuthProvider;
