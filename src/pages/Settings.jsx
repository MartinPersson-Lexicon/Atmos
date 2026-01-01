import React, { useContext } from "react";
import { ThemeContext, DEFAULT_COLORS } from "../context/ThemeContext";

export default function Settings() {
  const { theme, setTheme, colors, setColors } = useContext(ThemeContext);

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <section>
        <h3>Theme</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label>
            <input
              type="radio"
              name="theme"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />
            Light
          </label>
          <label>
            <input
              type="radio"
              name="theme"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
            Dark
          </label>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Colors</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
            <label>Primary</label>
            <div>
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => setColors({ primary: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label>Accent</label>
            <div>
              <input
                type="color"
                value={colors.accent}
                onChange={(e) => setColors({ accent: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => setColors(DEFAULT_COLORS)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--accent)", color: "#fff" }}
          >
            Reset to default colors
          </button>
        </div>
      </section>
    </div>
  );
}
