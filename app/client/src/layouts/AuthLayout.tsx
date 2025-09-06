/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { useAuth } from "@client/stores/auth.store.js";

export function AuthLayout() {
  const { user, isAuthenticated } = useAuth();
  const naviagate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      naviagate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <Outlet />
    </div>
  );
}
