import { createContext, useContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

export { ThemeContext, useTheme };
