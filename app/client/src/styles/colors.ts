const baseColors = {
  primary: "#25eb8fff",
  secondary: "#73648bff",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#f59e0b",
};

export const COLORS = {
  light: {
    ...baseColors,
    background: "#f9fafb",
    text: "#111827",
  },
  dark: {
    ...baseColors,
    background: "#111827",
    text: "#f9fafb",
  },
} as const;

export type ThemeType = keyof typeof COLORS;
export type ThemeColorNameType = keyof (typeof COLORS)["light"];
export type ColorNameType = keyof typeof baseColors;
export type ColorsType = (typeof COLORS)[ThemeType];
