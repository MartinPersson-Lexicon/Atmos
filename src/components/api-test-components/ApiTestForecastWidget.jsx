import { useEffect, useState } from "react";
import { getForecastForStation } from "../../api/weatherForecastApi";

export default function ApiTestForecastWidget({ stationId = 52350 }) {
  const [parameterKeys, setParameterKeys] = useState([
    "air_temperature",
    "symbol_code",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getForecastForStation(stationId, parameterKeys);
        if (mounted) setForecast(res);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [stationId, parameterKeys]);

  return (
    <div className="api-test-forecast-widget">
      <h3>ApiTestForecastWidget</h3>
      <h4>Forecast ({parameterKeys.join(", ")}) — station {stationId}</h4>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={parameterKeys.includes("air_temperature")}
            onChange={(e) => {
              const checked = e.target.checked;
              setParameterKeys((prev) => {
                if (checked) return Array.from(new Set([...prev, "air_temperature"]));
                return prev.filter((p) => p !== "air_temperature");
              });
            }}
          />
          <span style={{ marginLeft: 6 }}>air_temperature</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={parameterKeys.includes("symbol_code")}
            onChange={(e) => {
              const checked = e.target.checked;
              setParameterKeys((prev) => {
                if (checked) return Array.from(new Set([...prev, "symbol_code"]));
                return prev.filter((p) => p !== "symbol_code");
              });
            }}
          />
          <span style={{ marginLeft: 6 }}>symbol_code</span>
        </label>
      </div>
      {loading && <div>Loading forecast…</div>}
      {error && <div style={{ color: "#c00" }}>Error: {error}</div>}
      {forecast && (
        <div>
          <div>
            <strong>Station:</strong> {forecast.stationModel.stationName} —{" "}
            {forecast.stationModel.city}
          </div>
          <div>
            <strong>Coordinates:</strong>{" "}
            {Array.isArray(forecast.coordinates)
              ? `${forecast.coordinates[1]}, ${forecast.coordinates[0]}`
              : `${forecast.stationModel.lat}, ${forecast.stationModel.lon}`}
          </div>
          <div style={{ marginTop: 8 }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 6 }}>Time</th>
                  {parameterKeys.includes("air_temperature") && (
                    <th style={{ textAlign: "left", padding: 6 }}>air_temperature (°C)</th>
                  )}
                  {parameterKeys.includes("symbol_code") && (
                    <>
                      <th style={{ textAlign: "left", padding: 6 }}>symbol_code</th>
                      <th style={{ textAlign: "left", padding: 6 }}>Emoji</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {forecast.series.slice(0, 24).map((s) => (
                  <tr key={s.time}>
                    <td style={{ padding: 6 }}>{s.time}</td>
                    {parameterKeys.includes("air_temperature") && (
                      <td style={{ padding: 6 }}>{s.values?.air_temperature ?? "—"}</td>
                    )}
                    {parameterKeys.includes("symbol_code") && (
                      <>
                        <td style={{ padding: 6 }}>{s.values?.symbol_code ?? "—"}</td>
                        <td style={{ padding: 6 }}>{s.emoji ?? "—"}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
