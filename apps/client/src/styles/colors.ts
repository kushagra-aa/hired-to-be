export const COLORS = {
  primary: "oklch(0.5572 0.2617 304.98)",
  secondary: "oklch(0.6734 0.1925 322.67)",
  accent: "oklch(0.47 0.0937 298.63)",
  success: "oklch(62% 0.17 152deg)",
  danger: "oklch(63% 0.23 29deg)",
  warning: "oklch(80% 0.16 70deg)",
  backgorund: "oklch(20% 0.01 260deg)",
  foreground: "oklch(97% 0 0deg)",
} as const;

export type ThemePalette = typeof COLORS;
export type ColorsEnum = keyof typeof COLORS;
