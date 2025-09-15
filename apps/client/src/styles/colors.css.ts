import { COLORS, ThemePalette } from "./colors";

function setVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

export function applyPalette(p: ThemePalette) {
  setVar("--pro-color-primary", p.primary);
  setVar("--pro-color-secondary", p.secondary);
  setVar("--pro-color-accent", p.accent);
  setVar("--pro-color-success", p.success);
  setVar("--pro-color-danger", p.danger);
  setVar("--pro-color-warning", p.warning);
  setVar("--pro-color-background", p.backgorund);
  setVar("--pro-color-foregorund", p.foreground);
}

export function applyTheme() {
  applyPalette(COLORS);
}

export function watchSystemChanges() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    applyTheme();
  };
  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
}
