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
        const latest = await weatherApi.getLatestFromFixedEndpoint();
        if (!mounted) return;
        setResult({ latest });
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

  const latest = result ? result.latest : null;

  return (
    <div className="widget weather-widget">
      <h3>Weather — Station 188790</h3>


      {latest ? (
        <div className="latest-sample">
          <p>
            Temp: {latest.value !== null ? latest.value : "-"}{" "}
          </p>
          <p>
            Date: {latest.date ? `at ${latest.date}` : "--"}
          </p>
          <p>
            Quality: {latest.quality ? ` ${latest.quality}` : "--"}
          </p>
        </div>
      ) : (
        <p>No latest sample available</p>
      )}
    </div>
  );
}
