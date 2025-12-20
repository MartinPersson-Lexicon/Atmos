import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";
import weatherApi from "../api/weather";

export default function WeatherWidget({
  stationId = 52350,
  lat,
  lon,
  parameter = "1",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const mountedRef = useRef(true);
  const prevDateRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const model = await weatherApi.populateWeatherModelFromStationId(
        stationId
      );
      if (!mountedRef.current) return;
      // compare with previous result datetime and mark as updated if newer
      const prevIso = prevDateRef.current;
      const prevTs = prevIso ? Date.parse(prevIso) : null;
      const newTs = model?.dateTime ? Date.parse(model.dateTime) : null;
      if (newTs && prevTs && newTs > prevTs) {
        setStatusMessage("Updated with newer weather data!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else if (newTs && prevTs && newTs === prevTs) {
        setStatusMessage("Already displaying the latest weather data!");
        setTimeout(() => setStatusMessage(null), 3000);
      }
      setResult(model);
      prevDateRef.current = model?.dateTime ?? prevDateRef.current;
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || String(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load, lat, lon, parameter]);

  const model = result || null;

  function formatDate(iso) {
    if (!iso) return "--";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return `${e}: no change in date formatting ${iso}`;
    }
  }

  return (
    <div className="widget weather-widget">
      <h3>This content and below is from ApiTestWidget</h3>

      <div style={{ marginBottom: 12 }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Fetching…" : "Fetch weather data"}
        </button>
      </div>

      {statusMessage && (
        <div
          className="updated-badge"
          style={{ color: "#7fff7f", marginBottom: 8 }}
        >
          {statusMessage}
        </div>
      )}

      {error && <div className="widget error">Error: {error}</div>}

      {model ? (
        <div className="latest-sample">
          <p>Temp: {model.temperature !== null ? model.temperature : "-"}</p>
          <p>Updated at: {formatDate(model.dateTime)}</p>
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
