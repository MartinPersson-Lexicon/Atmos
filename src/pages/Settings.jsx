import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { DEFAULT_COLORS } from "../utils/DefaultColors";

export default function Settings() {
  const { theme, setTheme, colors, setColors } = useContext(ThemeContext);
  const [alphaPct, setAlphaPct] = useState(() => {
    const hexToPct = (h) => {
      if (!h || typeof h !== "string") return 50;
      const s = h.replace("#", "");
      if (s.length === 8) {
        const aa = s.slice(6, 8);
        return Math.round((parseInt(aa, 16) / 255) * 100);
      }
      return 50;
    };
    return hexToPct(colors.primary50 || DEFAULT_COLORS.primary50);
  });

  const withAlphaHex = (hex, alpha) => {
    if (!hex) return "#00000000";
    const h = hex.replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h.slice(0, 6);
    const a = Math.round(255 * alpha)
      .toString(16)
      .padStart(2, "0");
    return `#${full}${a}`.toUpperCase();
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <h4>Selections will be automatically saved to local storage</h4>
      <p>&nbsp;</p>

      <div
        style={{
          marginTop: 18,
          marginBottom: 28,
          flexDirection: "row",
          gap: 32,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h3>Color Theming</h3>
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
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Base Colors</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
            marginTop: 22,
            marginBottom: 22,
          }}
        >
          {Object.keys(DEFAULT_COLORS)
            .slice(0, 5)
            .map((key) => {
              const val = colors[key] ?? DEFAULT_COLORS[key];
              const isSimpleHex =
                typeof val === "string" && /^#([A-Fa-f0-9]{6})$/.test(val);
              return (
                <div
                  key={key}
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <label style={{ textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: "transparent",
                      color: "var(--text)",
                      userSelect: "none",
                    }}
                  >
                    {val}
                  </div>
                  <div>
                    {isSimpleHex ? (
                      <input
                        type="color"
                        value={val}
                        onChange={(e) => setColors({ [key]: e.target.value })}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 10,
                          padding: 0,
                          background: val,
                          appearance: "none",
                          WebkitAppearance: "none",
                          border: "3px solid var(--accent)",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setColors({ [key]: e.target.value })}
                        style={{
                          width: "100%",
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.12)",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <h3>Base Colors with transparency</h3>
        {/* Row 2: transparency slider (sets alpha for all five colors) */}
        <div
          style={{
            marginTop: 18,
            marginBottom: 38,
            flexDirection: "row",
            gap: 22,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <label style={{ display: "block" }}>
            Set the transparency for base colors:
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={alphaPct}
              onChange={(e) => {
                const pct = Number(e.target.value);
                setAlphaPct(pct);
                const alpha = pct / 100;
                const keys = ["primary", "accent", "red", "orange", "yellow"];
                const updates = {};
                keys.forEach((k) => {
                  const base = colors[k] ?? DEFAULT_COLORS[k];
                  updates[`${k}50`] = withAlphaHex(base, alpha);
                });
                setColors(updates);
              }}
            />
            <div style={{ minWidth: 48 }}>{alphaPct}%</div>
          </div>
        </div>
        {/* alpha-preview boxes (non-clickable, reflect slider) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          {Object.keys(DEFAULT_COLORS)
            .slice(5)
            .map((key) => {
              const val = colors[key] ?? DEFAULT_COLORS[key];
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <label
                    style={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {key}
                  </label>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: "transparent",
                      color: "var(--text)",
                      userSelect: "none",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 10,
                      border: "3px solid var(--accent)",
                      background: val,
                      cursor: "default",
                    }}
                  />
                </div>
              );
            })}
        </div>

        {/* Reset all to default colors */}
        <div style={{ marginTop: 58 }}>
          <button
            onClick={() => setColors(DEFAULT_COLORS)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            Reset to default colors
          </button>
        </div>
      </section>
    </div>
  );
}
