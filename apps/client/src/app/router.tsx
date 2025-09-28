import { UserRoleEnum } from "@hiredtobe/shared/entities";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";

import { PageError } from "@/client/components/feedback/PageError";
import { PageLoader } from "@/client/components/feedback/PageLoader";
import { AuthLayout } from "@/client/layouts/AuthLayout";
import { MainLayout } from "@/client/layouts/MainLayout";

import { ProtectedRoute } from "./ProtectedRoute";

// Lazy load pages
const LoginPage = lazy(() => import("@/client/pages/auth/LoginPage"));
const HomePage = lazy(() => import("@/client/pages/HomePage"));
const TodosPage = lazy(() => import("@/client/pages/protected/TodosPage"));
const NotFoundPage = lazy(() => import("@/client/pages/NotFoundPage"));

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <PageError />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
        errorElement: <PageError />,
      },
      {
        path: "/organizations",
        element: (
          <ProtectedRoute roles={[UserRoleEnum.user]}>
            <Suspense fallback={<PageLoader />}>
              <TodosPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute roles={[UserRoleEnum.user]}>
            <Suspense fallback={<PageLoader />}>
              <TodosPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs/:id",
        element: (
          <ProtectedRoute roles={[UserRoleEnum.user]}>
            <Suspense fallback={<PageLoader />}>
              <TodosPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <PageError />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
        errorElement: <PageError />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

export const router = createBrowserRouter(routes);

// Can Configure User's Landing pages based on Roles
export const USER_LANDING_PAGES: Record<UserRoleEnum, string> = {
  ADMIN: "/admin",
  USER: "/todos",
};

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
