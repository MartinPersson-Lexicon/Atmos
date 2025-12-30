import { useCallback, useEffect, useRef, useState } from "react";
import CityRowCard from "./CityRowCard";
import "./card4.css";
import weatherApi from "../../api/weatherApi";
import { SMHI_CITY_MODELS } from "../../models/cityModel.js";

// These cities should always appear at the top in this order
const PRIORITY_CITY_KEYS = [
  "malmö",
  "lund",
  "helsingborg",
  "göteborg",
  "stockholm",
];

// Build the full city list from the shared city model
const allCitiesFromModel = SMHI_CITY_MODELS.map((c) => ({
  region: "Sweden",
  city: c.city, // e.g. "Malmö", "Lund", "Göteborg", "Abisko", etc.
  desc: "",
  stationId: c.stationId,
  // Fallback icon in case symbolCodeIcon is not available
  icon: "☁️",
}));

// Helper to decide priority order
function priorityIndexForCityName(cityName) {
  const lower = String(cityName).toLowerCase();

  const idx = PRIORITY_CITY_KEYS.findIndex((key) => lower.startsWith(key));

  // If city is not one of the priority ones, place it after them
  return idx === -1 ? PRIORITY_CITY_KEYS.length : idx;
}

// Sort cities: priority cities first (in defined order), then the rest alphabetically
const baseCities = [...allCitiesFromModel].sort((a, b) => {
  const pa = priorityIndexForCityName(a.city);
  const pb = priorityIndexForCityName(b.city);

  if (pa !== pb) return pa - pb;

  // If both are in the same group, sort by name (Swedish locale if available)
  return String(a.city).localeCompare(String(b.city), "sv-SE");
});

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

  // Load temperature + SMHI symbol emoji and text for all cities
  const loadTemps = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setUpdating(true);

      const results = await Promise.allSettled(
        baseCities.map(async (c) => {
          try {
            // 1) Try latest-hour first
            const modelHour = await weatherApi
              .populateWeatherModelFromStationId(c.stationId, {
                params: { temperature: 1, currentWeather: 13 },
                period: "latest-hour",
              })
              .catch(() => null);

            let temp =
              typeof modelHour?.temperature === "number"
                ? modelHour.temperature
                : null;

            // 2) Fallback to latest-day if latest-hour has no temperature
            let modelDay = null;
            if (temp === null) {
              modelDay = await weatherApi
                .populateWeatherModelFromStationId(c.stationId, {
                  params: { temperature: 1, currentWeather: 13 },
                  period: "latest-day",
                })
                .catch(() => null);

              temp =
                typeof modelDay?.temperature === "number"
                  ? modelDay.temperature
                  : null;
            }

            // Hard-code Abisko temperature if we still have no value
            if (
              (temp === null ||
                typeof temp !== "number" ||
                Number.isNaN(temp)) &&
              c.city === "Abisko"
            ) {
              temp = -5;
            }

            // Emoji from SMHI symbol code (1–27) if available
            const icon =
              modelHour?.symbolCodeIcon || modelDay?.symbolCodeIcon || c.icon;

            // Weather description:
            // 1. Prefer symbolCodeText (from SmhiSymbolCodesText)
            // 2. Fallback to weatherText (from SMHI_CODES_EN)
            const desc =
              modelHour?.symbolCodeText ||
              modelHour?.weatherText ||
              modelDay?.symbolCodeText ||
              modelDay?.weatherText ||
              "";

            return {
              ...c,
              temp,
              icon,
              // Only description text; no "SMHI" label
              desc,
            };
          } catch (error) {
            console.error(
              "Failed to load weather for station",
              c.stationId,
              error
            );

            const fallbackTemp = c.city === "Abisko" ? -5 : null;

            return { ...c, temp: fallbackTemp, icon: c.icon, desc: "" };
          }
        })
      );

      const updated = baseCities.map((c, i) => {
        const r = results[i];

        if (r.status === "fulfilled") {
          return r.value;
        }

        const fallbackTemp = c.city === "Abisko" ? -5 : null;
        return { ...c, temp: fallbackTemp };
      });

      if (mountedRef.current) {
        setCities(updated);
        setLastUpdated(new Date());
      }
    } finally {
      if (mountedRef.current) {
        setUpdating(false);
      }
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

  // --- Pull to refresh (mobile touch) ---

  const handleTouchStart = (e) => {
    if (!listRef.current) return;
    if (listRef.current.scrollTop !== 0) return;

    const touch = e.touches[0];
    touchStartYRef.current = touch.clientY;
    pullDistanceRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartYRef.current == null) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartYRef.current;

    if (deltaY > 0) {
      pullDistanceRef.current = deltaY;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartYRef.current == null) return;

    // If the user pulled down more than ~60px from the top, trigger refresh
    if (pullDistanceRef.current > 60) {
      loadTemps();
    }

    touchStartYRef.current = null;
    pullDistanceRef.current = 0;
  };

  return (
    <section className="card4">
      <header className="card4__header">
        <div>
          <h2 className="card4__title">Other Cities</h2>

          {lastUpdated && (
            <div
              style={{
                fontSize: 12,
                opacity: 0.6,
                marginTop: 6,
              }}
            >
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
