import { createTheme } from "@mui/material/styles";
import { useMemo, createContext } from "react";
import useLocalStorage from "./CustomHooks";
// color design token
const Fixed = {
  100: "#505597",
};
export const DarkModeData = {
  grey: {
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
  },
  primary: {
    100: "#d0d1d5",
    200: "#a1a4ab",
    300: "#474a50ff",
    400: "#1b1b1bff",
    500: "#2c2c2cff",
    600: "#101624",
    700: "#0c101b",
    800: "#080b12",
    900: "#040509",
  },
  greenAccent: {
    100: "#dbf5ee",
    200: "#b7ebde",
    300: "#94e2cd",
    400: "#70d8bd",
    500: "#4cceac",
    600: "#3da58a",
    700: "#2e7c67",
    800: "#1e5245",
    900: "#0f2922",
  },
  redAccent: {
    100: "#f8dcdb",
    200: "#f1b9b7",
    300: "#e99592",
    400: "#e2726e",
    500: "#db4f4a",
    600: "#af3f3b",
    700: "#832f2c",
    800: "#58201e",
    900: "#2c100f",
  },
  blueAccent: {
    100: "#e7e8fe",
    200: "#cfd1fd",
    300: "#b6bbfd",
    400: "#9ea4fc",
    500: "#868dfb",
    600: "#6b71c9",
    700: "#505597",
    800: "#363864",
    900: "#1b1c32",
  },
  Font: {
    100: "#cfcfcfff",
    200: "#747474ff",
    300: "#3a3a3aff",
    400: "#cfcfcfff",
    500: "#949bffff",
  },
  Fixed: Fixed,
};

const LightModeData = {
  Fixed: Fixed,
  Font: {
    100: "#3a3a3aff",
    200: "#aeaeaeff",
    300: "#3a3a3aff",
    400: "#cfcfcfff",
    500: "#939bffff",
  },
  grey: {
    900: "#e0e0e0",
    800: "#c2c2c2",
    700: "#a3a3a3",
    600: "#858585",
    500: "#666666",
    400: "#525252",
    300: "#3d3d3d",
    200: "#292929",
    100: "#141414",
  },
  primary: {
    900: "#d0d1d5",
    800: "#a1a4ab",
    700: "#727681",
    600: "#434957",
    500: "#86888fff",
    400: "#242a52ff",
    300: "#bdbdbdff",
    200: "#080b12",
    100: "#040509",
  },
  greenAccent: {
    900: "#dbf5ee",
    800: "#b7ebde",
    700: "#94e2cd",
    600: "#70d8bd",
    500: "#4cceac",
    400: "#3da58a",
    300: "#2e7c67",
    200: "#1e5245",
    100: "#0f2922",
  },
  redAccent: {
    900: "#f8dcdb",
    800: "#f1b9b7",
    700: "#e99592",
    600: "#e2726e",
    500: "#db4f4a",
    400: "#af3f3b",
    300: "#832f2c",
    200: "#58201e",
    100: "#2c100f",
  },
  blueAccent: {
    900: "#e7e8fe",
    800: "#cfd1fd",
    700: "#b6bbfd",
    600: "#9ea4fc",
    500: "#868dfb",
    400: "#6b71c9",
    300: "#505597",
    200: "#363864",
    100: "#1b1c32",
  },
};

// export const darkModeData = (mode) => ({
//   ...(mode === "dark" ? DarkModeData : LightModeData),
// });

export const GetColors = (mode) => {
  if (mode === "dark") {
    return { ...DarkModeData };
  } else {
    return { ...LightModeData };
  }
};

// mui theme settings

export const themeSettings = (mode) => {
  const colors = GetColors(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#e2e2e2ff",
            },
          }),
    },
    typography: {
      fontFamily: ["SourceSans3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["SourceSans3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// content for colorMode

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, SetMode] = useState("dark");
  const [mode, SetMode] = useLocalStorage("themeMode", "dark");

  // compute once and resuse forever, create object that has a function name togglecolormode which calls setstate metod
  const colorMode = useMemo(
    () => ({
      // object having method which has definition to call set state
      toggleColorMode: () =>
        SetMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [SetMode]
  );
  // if any change in mode varible then call create theme of MUI and pass data for theme (getting theme data from themesettings)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
