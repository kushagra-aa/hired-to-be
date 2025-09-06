import { Outlet } from "react-router";

export function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Can Have Different Admin Nav */}
      {/* <AdminNav />  */}

      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
