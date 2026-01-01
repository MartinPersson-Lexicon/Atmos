import React, { createContext, useEffect, useState } from "react";

export const DEFAULT_COLORS = {
  primary: "#3a7bf6",
  accent: "#F0741C",
  red: "#E82025",
  orange: "#F0741C",
  yellow: "#FAC015",
};

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      console.log("Unable to get theme", e);
      return "light";
    }
  });

  const [colors, setColors] = useState(() => {
    try {
      const raw = localStorage.getItem("themeColors");
      return raw ? JSON.parse(raw) : DEFAULT_COLORS;
    } catch (e) {
      console.log("Unable to get theme colors", e);

      return DEFAULT_COLORS;
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(
      theme === "dark" ? "theme-dark" : "theme-light"
    );
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.log("Unable to save theme", e);
      throw e;
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--accent", colors.accent);
    // add a simple gradient token derived from red and yellow colors
    root.style.setProperty(
      "--primary-grad",
      `linear-gradient(135deg, ${colors.red} 0%, ${colors.yellow} 100%)`
    );
    try {
      localStorage.setItem("themeColors", JSON.stringify(colors));
    } catch (e) {
        console.log("Unable to save theme colors", e);
        throw e;
    }
  }, [colors]);

  const updateColors = (next) => setColors((cur) => ({ ...cur, ...next }));

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colors, setColors: updateColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
