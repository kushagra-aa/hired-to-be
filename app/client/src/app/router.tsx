import { UserRoleEnum } from "@shared/types/entities/user.entity.js";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";

import { PageError } from "@client/components/feedback/PageError.js";
import { PageLoader } from "@client/components/feedback/PageLoader.js";
import { AdminLayout } from "@client/layouts/AdminLayout.js";
import { AuthLayout } from "@client/layouts/AuthLayout.js";
import { MainLayout } from "@client/layouts/MainLayout.js";

import { ProtectedRoute } from "./ProtectedRoute.js";

// Lazy load pages
const LoginPage = lazy(() => import("@client/pages/auth/LoginPage.js"));
const RegisterPage = lazy(() => import("@client/pages/auth/RegisterPage.js"));
const HomePage = lazy(() => import("@client/pages/HomePage/index.js"));
const TodosPage = lazy(
  () => import("@client/pages/protected/TodosPage/index.js"),
);
const AdminDashboardPage = lazy(
  () => import("@client/pages/protected/admin/AdminDashboardPage/index.js"),
);
const NotFoundPage = lazy(() => import("@client/pages/NotFoundPage/index.js"));

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
        path: "/todos",
        element: (
          <ProtectedRoute roles={[UserRoleEnum.user]}>
            <Suspense fallback={<PageLoader />}>
              <TodosPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        element: <AdminLayout />,
        errorElement: <PageError />,
        children: [
          {
            path: "/admin",
            element: (
              <ProtectedRoute roles={[UserRoleEnum.admin]}>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboardPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
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
      {
        path: "/register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
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
