import { useState, useEffect, useRef } from "react";
import "../App.css";
import "../Dashboard.css";
import CardOneWidget from "../components/card-one/CardOneWidget";
import CardTwoWidget from "../components/card-two/CardTwoWidget";
import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
import Card3Forecast from "../components/Card3Forecast/Card3Forecast";
import { SMHI_CITY_MODELS } from "../models/cityModel";
import { populateWeatherModelFromStationId } from "../api/weatherApi";

// Ordered mapping for symbol codes -> video file (first match wins)
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

export default function Home() {
  // Shared selected city for Card 1, Card 2 and Card 3
  const [selectedCity, setSelectedCity] = useState("Malmö");

  // Current time string used in Card 2 props (HH:mm)
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const timeString = `${hours}:${minutes}`;
  const videoRef = useRef(null);
  const [symbolCode, setSymbolCode] = useState(null);

  // Whenever selected city changes, fetch a small weather model to get symbolCode
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

  // When symbolCode changes, update video source
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const file = pickVideoForCode(symbolCode);
    // Use a fallback video when no mapping exists or symbol fetch failed
    const chosen = file || "flames.mp4";
    // Expect videos to be placed in public/videos/
    const src = `/videos/${chosen}`;
    if (vid.getAttribute("src") !== src) {
      vid.style.display = "block";
      vid.src = src;
      vid.load();
      // attempt to play; browsers may block autoplay if not muted — video is muted
      const p = vid.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [symbolCode]);

  return (
    <>
      {/* Background video for Home page; videos should live in public/videos/ */}
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
        <div className="dashboard-main">
          {/* Row 1 – left: Card 1 */}
          <div className="dashboard-cell dashboard-cell--card1">
            <CardOneWidget
              cityName={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>

          {/* Row 1 – right: Card 2 */}
          <div className="dashboard-cell dashboard-cell--card2">
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

          {/* Row 2 – left: Card 4 (Other Cities) */}
          <div className="dashboard-cell dashboard-cell--card4">
            <Card4OtherCities />
          </div>

          {/* Row 2 – right: Card 3 (10 Day Forecast) */}
          <div className="dashboard-cell dashboard-cell--card3">
            <Card3Forecast cityName={selectedCity} />
          </div>
        </div>
      </div>

      <div className="homeRight">
        {/* Right side is empty for now (other cards will go here later) */}
      </div>
    </>
  );
}
