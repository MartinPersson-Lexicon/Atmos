import { useEffect, useState } from "react";
import "../App.css";
import weatherApi from "../api/weather";

export default function WeatherWidget({ lat, lon, parameter = "1" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const coords =
          lat != null && lon != null
            ? { lat, lon }
            : { lat: 59.33, lon: 18.06 };
        const res = await weatherApi.getNearestStationData(
          coords.lat,
          coords.lon,
          parameter
        );
        if (!mounted) return;
        setResult(res);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [lat, lon, parameter]);

  if (loading) return <div className="widget">Loading weather…</div>;
  if (error) return <div className="widget error">Error: {error}</div>;
  if (!result) return <div className="widget">No data</div>;

  const { station, distanceKm, period, data } = result;

  return (
    <div className="widget weather-widget">
      <h3>
        Weather — {station && (station.name || station.title || station.id)}
      </h3>
      <p>
        Distance: {distanceKm ? distanceKm.toFixed(1) : "?"} km — Station id:{" "}
        {station.key || station.id}
      </p>

      {period && <p>Period: {period.title || period.key}</p>}

      {data ? (
        data.type === "json" ? (
          <pre style={{ maxHeight: 240, overflow: "auto" }}>
            {JSON.stringify(data.payload, null, 2)}
          </pre>
        ) : (
          <div>
            <p>CSV preview:</p>
            <pre style={{ maxHeight: 240, overflow: "auto" }}>
              {String(data.payload).split("\n").slice(0, 10).join("\n")}
            </pre>
          </div>
        )
      ) : (
        <p>No period data available</p>
      )}
    </div>
  );
}
