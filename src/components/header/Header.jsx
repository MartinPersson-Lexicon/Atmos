import "./Header.css";
import { useEffect, useState } from "react";

export default function Header({ selectedCity, setSelectedCity, cityOptions }) {
  // const { theme, setTheme } = useContext(ThemeContext);
  const getFormattedDate = (date = new Date()) => {
    const now = date;
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("en-GB", options);
  };

  const [nowDate, setNowDate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNowDate(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  // draw video into canvas clipped to the logo text
  useEffect(() => {
    const video = document.getElementById("header-logo-video");
    const canvas = document.getElementById("header-logo-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const logoText = "Atmos";

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let rafId = null;

    function draw() {
      if (!video || !ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      try {
        ctx.drawImage(video, 0, 0, w, h);
        ctx.globalCompositeOperation = "destination-in";
        const style = window.getComputedStyle(canvas.parentElement);
        const fontSize = parseFloat(style.fontSize) || 24;
        const fontFamily = style.fontFamily || "Inter, system-ui, sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillText(logoText, w / 2, h / 2);
        ctx.globalCompositeOperation = "source-over";
      } catch {
        // ignore draw errors
      }
      rafId = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      if (video) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
      if (rafId == null) draw();
    }

    window.addEventListener("resize", resize);
    start();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredOptions = cityOptions.filter((city) =>
    inputValue === ""
      ? true
      : city.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <header className="header">
      <p className="date">{getFormattedDate(nowDate)}</p>
      <div className="header-logo" aria-hidden="true">
        <video
          id="header-logo-video"
          src="/videos/flames.mp4"
          muted
          loop
          playsInline
          preload="auto"
          style={{ display: "none" }}
        />
        <canvas id="header-logo-canvas" />
      </div>
      <div className="header-right">
        <div className="search-bar" style={{ position: "relative" }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search your location"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            style={{ zIndex: 2 }}
          />
          {showDropdown && filteredOptions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                minWidth: 0,
                background: "var(--surface)",
                border: "1px solid var(--muted-border)",
                borderRadius: 8,
                maxHeight: 140,
                overflowY: "auto",
                zIndex: 10,
                listStyle: "none",
                margin: 0,
                padding: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {filteredOptions.map((city) => (
                <li
                  key={city}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                  onMouseDown={() => {
                    setSelectedCity(city);
                    setInputValue(""); // Clear input after selection
                    setShowDropdown(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
