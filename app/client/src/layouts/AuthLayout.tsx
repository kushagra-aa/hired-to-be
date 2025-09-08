/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { USER_LANDING_PAGES } from "@client/app/router.js";
import { NavBar } from "@client/components/NavBar/index.js";
import { useAuth } from "@client/stores/auth.store.js";

export function AuthLayout() {
  const { user, isAuthenticated } = useAuth();
  const naviagate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      naviagate(USER_LANDING_PAGES[user.role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
