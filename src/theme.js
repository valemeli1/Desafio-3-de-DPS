import { MD3DarkTheme } from "react-native-paper";

export const COLORS = {
  background: "#100D1C",
  surface: "#1C1730",
  surfaceLight: "#29213F",
  primary: "#A78BFA",
  secondary: "#C084FC",
  text: "#F5F3FF",
  textSecondary: "#B8AECF",
  border: "#39304F",
  danger: "#FB7185",
  success: "#34D399",
  white: "#FFFFFF",
};

export const theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 14,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.surfaceLight,
    onBackground: COLORS.text,
    onSurface: COLORS.text,
    onSurfaceVariant: COLORS.textSecondary,
    outline: COLORS.border,
    error: COLORS.danger,
  },
};

export default theme;
