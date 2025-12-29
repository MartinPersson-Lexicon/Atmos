import "./card3.css";
import { useEffect, useState } from "react";
import { get10DayForecastForStation } from "../../api/weatherForecastApi";
import { SMHI_CITY_MODELS } from "../../models/cityModel";

// I use this helper to find the stationId based on the selected city name
function getStationIdFromCity(cityName) {
  if (!cityName) return 52350; // I use Malmö as a default
  const found = SMHI_CITY_MODELS.find(
    (c) => c.city.toLowerCase() === cityName.toLowerCase()
  );
  // If nothing matches, I still fall back to Malmö
  return found ? found.stationId : 52350;
}

// Here I convert the ISO date into labels like Today / Tomorrow / Mon / Tue / ...
function getDayLabel(index, isoDate) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  // Example output: Mon, Tue, Wed
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

// This is my Card 3 component that shows a 10-day forecast in 2 rows (5+5)
export default function Card3Forecast({ cityName = "Malmö" }) {
  // I keep the list of days here after mapping the backend response
  const [days, setDays] = useState([]);
  // I use these states to show loading and possible errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever the component mounts or the cityName changes, I load the latest forecast
  useEffect(() => {
    let mounted = true; // I use this flag to avoid setting state after unmount

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // First I resolve the correct SMHI stationId for the selected city
        const stationId = getStationIdFromCity(cityName);

        // Here I reuse the backend call (similar to ApiTestForecastWidget.jsx)
        // and request temperature and symbol data
        const res = await get10DayForecastForStation(stationId, [
          "air_temperature",
          "symbol_code",
        ]);

        const series = Array.isArray(res.series) ? res.series : [];

        // I only take the first 10 entries and map them to what I need in the UI
        const mapped = series.slice(0, 10).map((item, index) => {
          const values = item.values || {};
          const min = values.air_temperature_min ?? null;
          const max = values.air_temperature_max ?? null;

          return {
            key: item.time,
            label: getDayLabel(index, item.time), // Friendly label for the day
            emoji: item.emoji ?? "❓", // Emoji/icon that is mapped from symbolCode
            min,
            max, // I keep both min and max so the card is fully driven by backend data
          };
        });

        if (mounted) setDays(mapped);
      } catch (err) {
        // If something fails, I store the error so I can see it in the UI
        if (mounted) {
          setError(err.message || String(err));
          setDays([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // I trigger the API call here
    load();

    // Cleanup in case the component unmounts during the request
    return () => {
      mounted = false;
    };
  }, [cityName]);

  return (
    <section className="card3">
      {/* Header of my 10 Day Forecast card */}
      <header className="card3__header">
        <h2 className="card3__title">
          10 Day Forecast <span className="card3__city">— {cityName}</span>
        </h2>
      </header>

      {/* While data is loading I show a small loading text */}
      {loading && (
        <div className="card3__status card3__status--loading">
          Loading forecast…
        </div>
      )}

      {/* If there is an error, I show it here so I can debug */}
      {error && (
        <div className="card3__status card3__status--error">Error: {error}</div>
      )}

      {/* 
        I render all 10 days in a 2-row grid (5 columns).
        This should look similar to Card 4 style, but dedicated for 10 Day Forecast.
      */}
      <div className="card3__grid">
        {days.map((d) => (
          <article key={d.key} className="card3Day">
            <div className="card3Day__label">{d.label}</div>

            {/* This icon/emoji comes from the backend via symbolCodeIcon mapping */}
            <div className="card3Day__icon" aria-hidden="true">
              {d.emoji}
            </div>

            {/* 
              I show the max temperature as the main value,
              and the min temperature as a smaller secondary value.
            */}
            <div className="card3Day__temps">
              <div className="card3Day__tempMax">
                {d.max !== null && d.max !== undefined ? `${d.max}°` : "–"}
              </div>
              <div className="card3Day__tempMin">
                {d.min !== null && d.min !== undefined ? `${d.min}°` : "–"}
              </div>
            </div>
          </article>
        ))}

        {/* If there is no data (and also not loading / no error), I show a simple message */}
        {!loading && !error && days.length === 0 && (
          <div className="card3__noData">No forecast data</div>
        )}
      </div>
    </section>
  );
}
