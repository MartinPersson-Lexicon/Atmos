import React, { useEffect, useState } from "react";
import { DEFAULT_COLORS } from "../utils/DefaultColors";
import { ThemeContext } from "./ThemeContext";

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
      // don't re-throw — avoids crashing the app when localStorage is unavailable
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
    root.style.setProperty(
      "--primary-grad-50",
      `linear-gradient(135deg, ${colors.red50} 0%, ${colors.yellow50} 100%)`
    );
    // expose 50% transparent tokens as 8-digit hex (fallback by appending alpha)
    const withAlphaHex = (hex, alpha = 0.5) => {
      if (!hex) return "#00000000";
      const h = hex.replace("#", "");
      // expand shorthand #abc -> aabbcc
      const full =
        h.length === 3
          ? h
              .split("")
              .map((c) => c + c)
              .join("")
          : h;
      const a = Math.round(255 * alpha)
        .toString(16)
        .padStart(2, "0");
      return `#${full}${a}`.toUpperCase();
    };

    root.style.setProperty(
      "--primary-50",
      (colors.primary50 || withAlphaHex(colors.primary, 0.5)).toString()
    );
    root.style.setProperty(
      "--accent-50",
      (colors.accent50 || withAlphaHex(colors.accent, 0.5)).toString()
    );
    root.style.setProperty(
      "--red-50",
      (colors.red50 || withAlphaHex(colors.red, 0.5)).toString()
    );
    root.style.setProperty(
      "--orange-50",
      (colors.orange50 || withAlphaHex(colors.orange, 0.5)).toString()
    );
    root.style.setProperty(
      "--yellow-50",
      (colors.yellow50 || withAlphaHex(colors.yellow, 0.5)).toString()
    );
    try {
      localStorage.setItem("themeColors", JSON.stringify(colors));
    } catch (e) {
      console.log("Unable to save theme colors", e);
      // don't re-throw — avoids crashing the app when localStorage is unavailable
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
