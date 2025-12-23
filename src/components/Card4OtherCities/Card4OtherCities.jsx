import { useEffect, useState } from "react";
import CityRowCard from "./CityRowCard";
import "./card4.css";
import weatherApi from "../../api/weatherApi"; // 

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

export default function Card4OtherCities() {
  const [cities, setCities] = useState(
    baseCities.map((c) => ({ ...c, temp: null }))
  );
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTemps() {
      setUpdating(true);

      const results = await Promise.allSettled(
        baseCities.map(async (c) => {
          // Try latest-hour first (some stations may not have it)
          const modelHour = await weatherApi.populateWeatherModelFromStationId(
            c.stationId,
            {
              params: { temperature: 1 },
              period: "latest-hour",
            }
          );

          let temp =
            typeof modelHour?.temperature === "number"
              ? modelHour.temperature
              : null;

          // Fallback to latest-day if latest-hour is missing
          if (temp === null) {
            const modelDay = await weatherApi.populateWeatherModelFromStationId(
              c.stationId,
              {
                params: { temperature: 1 },
                period: "latest-day",
              }
            );

            temp =
              typeof modelDay?.temperature === "number"
                ? modelDay.temperature
                : null;
          }

          return { ...c, temp };
        })
      );

      const updated = baseCities.map((c, i) => {
        const r = results[i];
        return r.status === "fulfilled" ? r.value : { ...c, temp: null };
      });

      if (mounted) {
        setCities(updated);
        setUpdating(false);
      }
    }

    loadTemps();

    // Optional: refresh every 10 minutes
    // const id = setInterval(loadTemps, 10 * 60 * 1000);

    return () => {
      mounted = false;
      // clearInterval(id);
    };
  }, []);

  return (
    <section className="card4">
      <header className="card4__header">
        <h2 className="card4__title">Other Cities</h2>

        <button className="card4__seeAll" type="button">
          {updating ? "Updating…" : "See All"}{" "}
          <span className="card4__chev">▾</span>
        </button>
      </header>

      <div className="card4__list">
        {cities.map((city) => (
          <CityRowCard key={`${city.region}-${city.city}`} data={city} />
        ))}
      </div>
    </section>
  );
}
