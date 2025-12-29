import "../../App.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import weatherApi from "../../api/weatherApi";
import { formatDate } from "../../utils/ApiUtils";
import "./StationList.css";

export default function ApiTestListWidget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const model = await weatherApi.fetchWeaterForAllStrationIds();
      if (!mountedRef.current) return;
      setResult(model);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || String(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const model = result || null;

  return (
    <div className="api-test-list-widget">
      <h2>API Test List Widget</h2>
      {loading && <div>Loading data for all stations…</div>}
      {error && <div className="error">Error: {error}</div>}
      {model && (
        <div className="station-list">
          {Object.entries(model).map(([stationId, { data, error }]) => (
            <div key={stationId} className="station-item">
              <h3>Station ID: {stationId}</h3>
              {error ? (
                <div className="error">Error: {error}</div>
              ) : data ? (
                <div className="latest-sample">
                  <p>Date: {formatDate(data.dateTime) ?? "--"}</p>
                  <p>
                    City: {data.cityName ?? "--"}
                  </p>
                  <p>
                    Temp: { data.temperature ?? "--"}°
                  </p>
                  <p>
                    SymbolCode ({data.symbolCode ?? "--"}): {data.symbolCodeIcon ?? "--"}
                  </p>
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
