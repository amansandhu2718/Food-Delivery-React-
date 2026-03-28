import { createTheme } from "@mui/material/styles";

// Premium Color Design Tokens
export const tokens = (mode) => {
  const isDark = mode === "dark";
  const primary = {
    main: "#018029",
    light: "#059669",
    dark: "#064e3b",
    500: "#018029", // Legacy support
  };
  const secondary = {
    main: "#f97316",
    light: "#fb923c",
    dark: "#ea580c",
    500: "#f97316", // Legacy support
  };
  const grey = isDark
    ? {
        100: "#e0e0e0", 200: "#c2c2c2", 300: "#a3a3a3", 400: "#858585",
        500: "#666666", 600: "#525252", 700: "#3d3d3d", 800: "#292929", 900: "#141414",
      }
    : {
        100: "#141414", 200: "#292929", 300: "#3d3d3d", 400: "#525252",
        500: "#666666", 600: "#858585", 700: "#a3a3a3", 800: "#c2c2c2", 900: "#e0e0e0",
      };

  return {
    primary,
    secondary,
    grey,
    // Legacy mapping for backward compatibility and to prevent crashes
    greenAccent: primary,
    blueAccent: primary,
    redAccent: secondary,
    fontAccent: { 400: isDark ? "#ffffff" : "#171717" },
    Font: {
      100: isDark ? "#ffffff" : "#171717",
      400: isDark ? "#ffffff" : "#171717",
      500: isDark ? "#ffffff" : "#171717",
    },
    Fixed: { 100: isDark ? "#171717" : "#ffffff" },
    background: isDark
      ? { default: "#0a0a0a", paper: "#171717" }
      : { default: "#ecececff", paper: "#ffffff" },
  };
};

// MUI theme settings
export const themeSettings = (mode) => {
  const isDark = mode === "dark";
  const colors = tokens(mode);

  return {
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: "#ffffff",
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: "#ffffff",
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: isDark ? "#ffffff" : "#171717",
        secondary: isDark ? "#a3a3a3" : "#525252",
      },
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      h1: {
        fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 800,
      },
      h2: {
        fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 800,
      },
      h3: {
        fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 800,
      },
      h4: {
        fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 700,
      },
      h5: {
        fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 700,
      },
      body1: {
        fontSize: 14,
        fontWeight: 500,
      },
      body2: {
        fontSize: 12,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "100px",
            textTransform: "none",
            fontWeight: 700,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "32px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
          },
        },
      },
    },
  };
};

export const GetColors = (mode) => tokens(mode);
