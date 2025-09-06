import { COLORS, ColorsType, ThemeType } from "./colors.js";

export const getTheme = (theme?: ThemeType): ThemeType => {
  let resolvedTheme: ThemeType;
  if (theme) {
    resolvedTheme = theme;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    resolvedTheme = "dark";
  } else {
    resolvedTheme = "light"; // fallback
  }
  return resolvedTheme;
};
export const getThemeColors = (): ColorsType => COLORS[getTheme()];

/**
 * Injects CSS variables into :root based on theme.
 * - Uses prefers-color-scheme if no theme is passed
 * - Falls back to "light"
 */
export function injectCssVariables(theme?: ThemeType) {
  const root = document.documentElement;

  // Detect system preference if no theme is provided
  const resolvedTheme: ThemeType = getTheme(theme);

  const themeColors = getThemeColors();

  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Optional: add a data attribute for styling hooks
  root.setAttribute("data-theme", resolvedTheme);
}

export function watchSystemTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = () => {
    injectCssVariables(media.matches ? "dark" : "light");
  };

  media.addEventListener("change", applyTheme);
  applyTheme(); // initial run
}
