import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";
import weatherApi from "../api/weather";

export default function ApiTestWidget({
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
        setStatusMessage("Updated!");
        setTimeout(() => setStatusMessage(null), 4000);
      } else if (newTs && prevTs && newTs === prevTs) {
        setStatusMessage("Nothing new!");
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
    <div className="widget weather-widget" style={{ position: "relative" }}>
      <h3>This content and below is from ApiTestWidget</h3>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={load}
          disabled={loading}
          style={{
            border: "1px solid #3a3",
            color: "#e6ffe6",
            background: "transparent",
            padding: "6px 10px",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Fetching…" : "Fetch weather data"}
        </button>
      </div>

      {statusMessage && (
        <div
          role="alert"
          className="status-alert"
          style={{
            position: "absolute",
            top:86,
            left: "50%",
            transform: "translateX(-50%)",
            right: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "8px 12px",
            background: "#212121",
            color: "#e6ffe6",
            border: "1px solid #3a3",
            borderRadius: 8,
            zIndex: 2000,
          }}
        >
          <span style={{ flex: "1 1 auto" }}>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            style={{
              marginLeft: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              background: "#3a3",
              color: "#042",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Ok
          </button>
        </div>
      )}

      {error && <div className="widget error">Error: {error}</div>}

      {model ? (
        <div className="latest-sample">
          <p>Updated at: {formatDate(model.dateTime)}</p>
          <p>Temp: ${model.temperature !== null ? model.temperature : "-"} °C</p>
          <p>Wind dir: {model.windDirection ?? "--"} degrees</p>
          <p>Wind speed: {model.windSpeed ?? "--"} m/s</p>
          <p>Rain intensity: {model.rainIntensity ?? "--"} mm/h</p>
          <p>Relative humidity: {model.relativeHumidity ?? "--"} %</p>
          <p>Quality of temperature measurement: {model.quality ?? "--"}</p>
        </div>
      ) : (
        <p>No latest sample available</p>
      )}
    </div>
  );
}
