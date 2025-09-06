import { UserRoleEnum } from "@shared/types/entities/user.entity.js";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "@client/stores/auth.store.js";

import { USER_LANDING_PAGES } from "./router.js";

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: UserRoleEnum[]; // allowed roles
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // User is logged in but not authorized
    return <Navigate to={USER_LANDING_PAGES[user.role]} replace />; // Redirect to user's default Landing Page
  }

  return <>{children}</>;
}
