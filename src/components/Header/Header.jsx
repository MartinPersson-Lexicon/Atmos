import "./Header.css";

export default function Header({
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
}) {
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
          <button className="icon-btn">⚙️</button>
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}
