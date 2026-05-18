export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

type ColorTokens = {
  background: string;
  border: string;
  danger: string;
  primary: string;
  primaryText: string;
  success: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  warning: string;
};

export type Theme = {
  colors: ColorTokens;
  radius: typeof radius;
  spacing: typeof spacing;
};

export const lightTheme: Theme = {
  colors: {
    background: "#F7F8FA",
    border: "#D8DEE8",
    danger: "#C83333",
    primary: "#147E6F",
    primaryText: "#FFFFFF",
    success: "#168A52",
    surface: "#FFFFFF",
    surfaceMuted: "#EDF2F5",
    text: "#111827",
    textMuted: "#5B6575",
    warning: "#946200",
  },
  radius,
  spacing,
};

export const darkTheme: Theme = {
  colors: {
    background: "#101316",
    border: "#303840",
    danger: "#FF6B6B",
    primary: "#1FB59E",
    primaryText: "#07100E",
    success: "#55D48F",
    surface: "#171C20",
    surfaceMuted: "#20272D",
    text: "#F3F7FA",
    textMuted: "#A7B0BC",
    warning: "#F2B84B",
  },
  radius,
  spacing,
};
