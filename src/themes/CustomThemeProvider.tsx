import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customs/inputs";
import { dataDisplayCustomizations } from "./customs/dataDisplay";
import { feedbackCustomizations } from "./customs/feedback";
import { navigationCustomizations } from "./customs/navigation";
import { surfacesCustomizations } from "./customs/surfaces";
import {
  colorSchemes,
  typography,
  shadows,
  shape,
} from "./customs/themePrimitives";

interface CustomThemeProviderProps {
  children: React.ReactNode;
  themeComponents?: ThemeOptions["components"];
}

export default function CustomThemeProvider(props: CustomThemeProviderProps) {
  const { children, themeComponents } = props;
  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "data-mui-color-scheme",
          cssVarPrefix: "template",
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
          ...themeComponents,
        },
      }),
    [themeComponents]
  );
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
