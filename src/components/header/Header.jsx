import "./Header.css";
import { useEffect } from "react";

export default function Header({ searchQuery, setSearchQuery }) {
  // const { theme, setTheme } = useContext(ThemeContext);
  const getFormattedDate = () => {
    const now = new Date();
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

  return (
    <header className="header">
      <p className="date">{getFormattedDate()}</p>
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
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search your location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* <div className="header-actions">
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div> */}
      </div>
    </header>
  );
}
