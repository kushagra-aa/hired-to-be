import { Outlet } from "react-router";

import { NavBar } from "@/client/components/NavBar";

export function MainLayout() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "1rem" }}>
        <Outlet /> {/* child routes render here */}
      </main>
    </>
  );
}
