import { useEffect, useState } from "react";
import "../App.css";
import weatherApi from "../api/weather";

export default function WeatherWidget({ stationId = 52350, lat, lon, parameter = "1" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const model = await weatherApi.populateWeatherModelFromStationId(stationId);
        if (!mounted) return;
        setResult(model);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [stationId, lat, lon, parameter]);

  if (loading) return <div className="widget">Loading weather…</div>;
  if (error) return <div className="widget error">Error: {error}</div>;
  if (!result) return <div className="widget">No data</div>;

  const model = result || null;

  return (
    <div className="widget weather-widget">
      <h3>Weather — Station 188790</h3>


      {model ? (
        <div className="latest-sample">
          <p>Temp: {model.temperature !== null ? model.temperature : "-"}</p>
          <p>Date: {model.dateTime ?? "--"}</p>
          <p>Quality: {model.quality ?? "--"}</p>
          <p>Wind dir: {model.windDirection ?? "--"}</p>
          <p>Wind speed: {model.windSpeed ?? "--"}</p>
        </div>
      ) : (
        <p>No latest sample available</p>
      )}
    </div>
  );
}
