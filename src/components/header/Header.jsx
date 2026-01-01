import "./Header.css";
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Header({ searchQuery, setSearchQuery }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const getFormattedDate = () => {
    const now = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return now.toLocaleDateString("en-GB", options);
  };

  return (
    <header className="header">
      <p className="date">{getFormattedDate()}</p>
      <div className="header-right">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search your location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}
