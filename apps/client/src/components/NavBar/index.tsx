import { ReactNode } from "react";
import { NavLink, type NavLinkProps } from "react-router";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/client/shadcn/components/ui/navigation-menu";
import { useAuth } from "@/client/stores/auth.store";

import { LogoutButton } from "../LogoutButton";
import { ThemeModeToggle } from "../ThemeToggle";
import styles from "./index.module.css";

const NavItemLink = (props: NavLinkProps & { as?: "anchor" }) =>
  props.as === "anchor" ? (
    <a href={props.to as string} className={styles.nav_item}>
      {props.children as ReactNode}
    </a>
  ) : (
    <NavLink
      {...props}
      className={({ isActive }) =>
        `${isActive && styles.active} ${styles.nav_item} ${props.className}`
      }
    />
  );

const NavItem = (props: NavLinkProps & { as?: "anchor" }) => (
  <NavigationMenuItem>
    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
      <NavItemLink {...props} />
    </NavigationMenuLink>
  </NavigationMenuItem>
);

export function NavBar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <NavigationMenu className="max-w-full py-4" viewport={false}>
      <NavigationMenuList className="gap-4 flex-1 w-full">
        <NavItem className="text-2xl" to="/" as="anchor">
          Home
        </NavItem>
        {isAuthenticated && user?.role === "USER" && (
          <>
            <NavItem to="/jobs">Jobs</NavItem>
            <NavItem to="/organizations">Organizations</NavItem>
          </>
        )}
        {!isAuthenticated && (
          <>
            <NavItem to="/login">Login</NavItem>
          </>
        )}
      </NavigationMenuList>
      <div className={styles.nav_actions}>
        {isAuthenticated && (
          <>
            <span className={styles.nav_text}>
              {user?.email ? `Welcome ${user.email}` : ""}
            </span>
            <div className={styles.nav_logout}>
              <LogoutButton />
            </div>
          </>
        )}
        <ThemeModeToggle />
      </div>
    </NavigationMenu>
  );
}
