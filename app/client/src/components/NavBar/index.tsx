import { NavLink, type NavLinkProps } from "react-router";

import { LogoutButton } from "@client/components/LogoutButton/index.js";
import { useAuth } from "@client/stores/auth.store.js";

import { ThemeModeToggle } from "../ThemeToggle.js";
import styles from "./index.module.css";

const NavItem = (props: NavLinkProps) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      `${isActive && styles.active} ${styles.nav_item} ${props.className}`
    }
  />
);

export function NavBar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className={styles.nav}>
      <NavItem className={styles.nav_home} to="/">
        Home
      </NavItem>
      {isAuthenticated && user?.role === "USER" && (
        <NavItem to="/todos">Todos</NavItem>
      )}
      {user?.role === "ADMIN" && <NavItem to="/admin">Admin</NavItem>}
      {!isAuthenticated ? (
        <>
          <NavItem to="/login">Login</NavItem>
          <NavItem to="/register">Register</NavItem>
        </>
      ) : (
        <>
          <span className={styles.nav_text}>Welcome, {user?.googleID}</span>
          <div className={styles.nav_logout}>
            <LogoutButton />
          </div>
        </>
      )}
      <ThemeModeToggle />
    </nav>
  );
}
