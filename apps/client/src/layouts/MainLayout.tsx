import { Outlet } from "react-router";

import { LogoutButton } from "@/client/components/LogoutButton";
import { NavBar } from "@/client/components/NavBar";
import { useAuth } from "@/client/stores/auth.store";

export function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <NavBar />
      <main style={{ padding: "1rem" }}>
        <Outlet /> {/* child routes render here */}
        {isAuthenticated && <LogoutButton isFloating />}
      </main>
    </>
  );
}
