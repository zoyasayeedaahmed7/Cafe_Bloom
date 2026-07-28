import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

/**
 * Owns day/night for the whole app. The stylesheet keys day mode off a `light`
 * class on <html>; components that paint with inline styles read `isDay` from
 * here instead — notably the navbar's SVG frame, whose stroke/fill are set as
 * SVG attributes and so cannot resolve a CSS variable.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const isDay = theme === "light";

  useEffect(() => {
    document.documentElement.classList.toggle("light", isDay);
  }, [isDay]);

  const value = useMemo(
    () => ({
      theme,
      isDay,
      toggleTheme: () => setTheme(isDay ? "dark" : "light"),
    }),
    // setTheme is recreated each render by useLocalStorage; `theme` is what
    // consumers actually re-render on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, isDay]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside a <ThemeProvider>");
  return ctx;
};
