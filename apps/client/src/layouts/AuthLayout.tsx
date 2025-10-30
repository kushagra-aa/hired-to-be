/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { USER_LANDING_PAGES } from "@/client/app/router";
import { NavBar } from "@/client/components/NavBar/index";
import { useAuth } from "@/client/stores/auth.store";

export function AuthLayout() {
  const { user, isAuthenticated } = useAuth();
  const naviagate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      ["/login", "/register"].includes(location.pathname)
    ) {
      naviagate(location.state.from || USER_LANDING_PAGES[user.role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, location]);

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
