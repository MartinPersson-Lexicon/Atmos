import { useState, useEffect, useRef } from "react";
import "../App.css";
import "../Dashboard.css";
import CardOneWidget from "../components/card-one/CardOneWidget";
import CardTwoWidget from "../components/card-two/CardTwoWidget";
import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
import Card3Forecast from "../components/Card3Forecast/Card3Forecast";
import { SMHI_CITY_MODELS } from "../models/cityModel";
import { populateWeatherModelFromStationId } from "../api/weatherApi";

export default function Home({ selectedCity, setSelectedCity }) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const videoRef = useRef(null);
  const [symbolCode, setSymbolCode] = useState(null);

  // Responsive breakpoint
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const found = SMHI_CITY_MODELS.find(
          (c) => c.city.toLowerCase() === selectedCity.toLowerCase()
        );
        const stationId = found ? found.stationId : null;
        if (!stationId) {
          setSymbolCode(null);
          return;
        }
        const model = await populateWeatherModelFromStationId(stationId);
        if (!mounted) return;
        const code = model?.symbolCode ?? model?.weatherCode ?? null;
        setSymbolCode(code);
      } catch {
        setSymbolCode(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selectedCity]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const file = pickVideoForCode(symbolCode);
    const chosen = file || "flames.mp4";
    const src = `/videos/${chosen}`;
    if (vid.getAttribute("src") !== src) {
      vid.style.display = "block";
      vid.src = src;
      vid.load();
      const p = vid.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [symbolCode]);

  // Grid cell style
  const cellStyle = {
    height: "100%",
    minHeight: 0,
    overflow: "auto",
  };

  // Layout styles: 2x2 on wide screens, 1 column on narrow screens
  const gridStyle = isNarrow
    ? {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridAutoRows: "minmax(280px, auto)",
        gap: "20px",
        // On narrow screens, allow page scroll naturally
        height: "auto",
        minHeight: 0,
        overflow: "visible",
      }
    : {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "24px",
        height: "calc(100dvh - 200px)",
        minHeight: 0,
        overflow: "hidden",
        alignItems: "stretch",
      };

  return (
    <>
      <video
        ref={videoRef}
        id="home-bg-video"
        loop
        muted
        playsInline
        preload="auto"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <div className="dashboard">
        <div className="dashboard-main" style={gridStyle}>
          <div
            className="dashboard-cell dashboard-cell--card1"
            style={cellStyle}
          >
            <CardOneWidget
              cityName={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>

          <div
            className="dashboard-cell dashboard-cell--card2"
            style={cellStyle}
          >
            <CardTwoWidget
              cityName={selectedCity}
              wind={{ value: 3.9, unit: "m/s", time: timeString }}
              humidity={{ value: 59, desc: "" }}
              uvIndex={{ value: null, desc: "uv" }}
              visibility={{ value: 89.7, time: timeString }}
              sunrise={"--"}
              sunset={"--"}
            />
          </div>

          <div
            className="dashboard-cell dashboard-cell--card4"
            style={cellStyle}
          >
            <Card4OtherCities />
          </div>

          <div
            className="dashboard-cell dashboard-cell--card3"
            style={cellStyle}
          >
            <Card3Forecast cityName={selectedCity} />
          </div>
        </div>
      </div>

      <div className="homeRight" />
    </>
  );
}

const VIDEO_MAP = [
  { codes: [1, 2], file: "sunny_palm_tree.mp4" },
  { codes: [3, 4], file: "sunny_clouds.mp4" },
  { codes: [5, 6, 7], file: "cloudy.mp4" },
  { codes: [8, 9, 10, 11, 12, 13, 14, 18, 19, 20, 21], file: "raining.mp4" },
  { codes: [15, 16, 17, 22, 23, 24, 25, 26, 27], file: "snowing.mp4" },
];

function pickVideoForCode(code) {
  if (code == null) return null;
  const n = Number(code);
  for (const m of VIDEO_MAP) {
    if (m.codes.includes(n)) return m.file;
  }
  return null;
}
