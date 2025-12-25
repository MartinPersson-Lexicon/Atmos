import { useCallback, useEffect, useRef, useState } from "react";
import CityRowCard from "./CityRowCard";
import "./card4.css";
import weatherApi from "../../api/weatherApi";

const baseCities = [
  {
    region: "Sweden",
    city: "Malmö",
    desc: "SMHI",
    stationId: 52350,
    icon: "🌤️",
  },
  {
    region: "Sweden",
    city: "Lund",
    desc: "SMHI",
    stationId: 53430,
    icon: "☁️",
  },
  {
    region: "Sweden",
    city: "Helsingborg",
    desc: "SMHI",
    stationId: 62040,
    icon: "🌧️",
  },
  {
    region: "Sweden",
    city: "Stockholm",
    desc: "SMHI",
    stationId: 97400,
    icon: "☀️",
  },
  {
    region: "Sweden",
    city: "Gothenburg",
    desc: "SMHI",
    stationId: 71420,
    icon: "💨",
  },
  {
    region: "Sweden",
    city: "Uppsala",
    desc: "SMHI",
    stationId: 97510,
    icon: "🌫️",
  },
];

// Uses WMO-style "present weather" ranges (SMHI param 13 is code-based).
function iconFromWeatherCode(code, fallbackIcon) {
  const n = Number(code);
  if (!Number.isFinite(n)) return fallbackIcon;

  // Thunderstorm / hail
  if (n >= 90 && n <= 99) return "⛈️";

  // Snow
  if (n >= 70 && n <= 79) return "🌨️";

  // Rain / showers / drizzle
  if ((n >= 50 && n <= 69) || (n >= 80 && n <= 86)) return "🌧️";

  // Fog / mist (typical ranges)
  if ((n >= 10 && n <= 19) || (n >= 40 && n <= 49)) return "🌫️";

  // Cloudy / overcast-ish
  if (n >= 4 && n <= 9) return "☁️";

  // Clear / mostly clear
  if (n >= 0 && n <= 3) return "☀️";

  return fallbackIcon;
}

// Optional: small readable text (keeps UI nicer than only "SMHI")
function textFromWeatherCode(code) {
  const n = Number(code);
  if (!Number.isFinite(n)) return null;

  if (n >= 90 && n <= 99) return "Thunderstorm";
  if (n >= 70 && n <= 79) return "Snow";
  if ((n >= 50 && n <= 69) || (n >= 80 && n <= 86)) return "Rain";
  if ((n >= 10 && n <= 19) || (n >= 40 && n <= 49)) return "Fog";
  if (n >= 4 && n <= 9) return "Cloudy";
  if (n >= 0 && n <= 3) return "Clear";

  return "Weather";
}

export default function Card4OtherCities() {
  const [cities, setCities] = useState(
    baseCities.map((c) => ({ ...c, temp: null }))
  );
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  // Pull-to-refresh (mobile)
  const listRef = useRef(null);
  const touchStartYRef = useRef(null);
  const pullDistanceRef = useRef(0);

  const loadTemps = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setUpdating(true);

      const results = await Promise.allSettled(
        baseCities.map(async (c) => {
          // 1) Temperature (try latest-hour, fallback latest-day)
          const modelHour = await weatherApi
            .populateWeatherModelFromStationId(c.stationId, {
              params: { temperature: 1 },
              period: "latest-hour",
            })
            .catch(() => null);

          let temp =
            typeof modelHour?.temperature === "number"
              ? modelHour.temperature
              : null;

          if (temp === null) {
            const modelDay = await weatherApi
              .populateWeatherModelFromStationId(c.stationId, {
                params: { temperature: 1 },
                period: "latest-day",
              })
              .catch(() => null);

            temp =
              typeof modelDay?.temperature === "number"
                ? modelDay.temperature
                : null;
          }

          // 2) Current weather code (param 13) for dynamic icon (try hour, fallback day)
          // This uses weatherApi.fetchLatestParam if your api layer exposes it.
          let weatherCode = null;

          if (typeof weatherApi.fetchLatestParam === "function") {
            const codeHour = await weatherApi
              .fetchLatestParam(c.stationId, 13, "latest-hour")
              .catch(() => null);

            weatherCode =
              codeHour?.value !== undefined && codeHour?.value !== null
                ? codeHour.value
                : null;

            if (weatherCode === null) {
              const codeDay = await weatherApi
                .fetchLatestParam(c.stationId, 13, "latest-day")
                .catch(() => null);

              weatherCode =
                codeDay?.value !== undefined && codeDay?.value !== null
                  ? codeDay.value
                  : null;
            }
          }

          const icon = iconFromWeatherCode(weatherCode, c.icon);
          const codeText = textFromWeatherCode(weatherCode);

          return {
            ...c,
            temp,
            icon,
            // If you prefer to keep "SMHI" always, replace this with: desc: "SMHI"
            desc: codeText ? `${codeText} (SMHI)` : "SMHI",
          };
        })
      );

      const updated = baseCities.map((c, i) => {
        const r = results[i];
        return r.status === "fulfilled" ? r.value : { ...c, temp: null };
      });

      if (mountedRef.current) {
        setCities(updated);
        setLastUpdated(new Date());
        setUpdating(false);
      }
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    loadTemps();

    // Auto refresh every 15 minutes
    const id = setInterval(loadTemps, 15 * 60 * 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [loadTemps]);

  // Pull-to-refresh handlers
  function handleTouchStart(e) {
    if (!listRef.current) return;
    if (listRef.current.scrollTop !== 0) return;
    touchStartYRef.current = e.touches[0].clientY;
    pullDistanceRef.current = 0;
  }

  function handleTouchMove(e) {
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const dy = currentY - touchStartYRef.current;
    pullDistanceRef.current = dy > 0 ? dy : 0;
  }

  function handleTouchEnd() {
    if (pullDistanceRef.current > 60) {
      loadTemps();
    }
    touchStartYRef.current = null;
    pullDistanceRef.current = 0;
  }

  return (
    <section className="card4">
      <header className="card4__header">
        <div>
          <h2 className="card4__title">Other Cities</h2>

          {lastUpdated && (
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
              Last update:{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        <button
          className="card4__seeAll"
          type="button"
          onClick={loadTemps}
          disabled={updating}
        >
          {updating ? "Updating…" : "Refresh"}{" "}
          <span className="card4__chev">↻</span>
        </button>
      </header>

      <div
        className="card4__list"
        ref={listRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cities.map((city) => (
          <CityRowCard key={`${city.region}-${city.city}`} data={city} />
        ))}
      </div>
    </section>
  );
}
