import "./CardTwoWidget.css";
import React, { useEffect, useState } from "react";
import weatherApi from "../../api/weatherApi";
import { SMHI_CITY_MODELS } from "../../models/cityModel";

// Helper to format time as HH:mm
function formatTime(date) {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CardTwoWidget = ({ cityName = "Malmö" }) => {
  const [data, setData] = useState({
    wind: { value: "-", unit: "km/h", time: "--" },
    humidity: { value: "-", desc: "--" },
    uvIndex: { value: "-", desc: "--" },
    visibility: { value: "-", time: "--" },
    sunrise: "07:55", // static example
    sunset: "15:48",  // static example
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const found = SMHI_CITY_MODELS.find(
          (c) => c.city.toLowerCase() === cityName.toLowerCase()
        );
        const stationId = found ? found.stationId : 52350;
        // Fetch main weather model
        const model = await weatherApi.populateWeatherModelFromStationId(stationId);
        // Fetch visibility (parameter id 12)
        let visibilityValue = "-";
        let visibilityTime = model.dateTime ? formatTime(model.dateTime) : "--";
        try {
          const vis = await weatherApi.fetchLatestParam(stationId, 12, "latest-hour");
          if (vis && vis.value !== null && vis.value !== undefined) {
            // Convert meters to km, round to 1 decimal
            visibilityValue = (vis.value / 1000).toFixed(1);
            visibilityTime = vis.date ? formatTime(vis.date) : visibilityTime;
          }
        } catch (err) {
        console.error(err);
        }

        // Fetch UV index from SMHI API
        let uvValue = "-";
        let uvDesc = "--";
        try {
          const uv = await weatherApi.getUvIndexForStation(stationId);
          if (uv && uv.uvIndex !== null && uv.uvIndex !== undefined) {
            uvValue = uv.uvIndex;
            // Simple description based on value
            if (uvValue < 3) uvDesc = "Low";
            else if (uvValue < 6) uvDesc = "Moderate";
            else if (uvValue < 8) uvDesc = "High";
            else if (uvValue < 11) uvDesc = "Very High";
            else uvDesc = "Extreme";
          }
        } catch (err) {
        console.error(err);
        }

        setData({
          wind: {
            value: model.windSpeed !== null && model.windSpeed !== undefined ? model.windSpeed : "-",
            unit: "m/s",
            time: model.dateTime ? formatTime(model.dateTime) : "--",
          },
          humidity: {
            value: model.relativeHumidity !== null && model.relativeHumidity !== undefined ? model.relativeHumidity : "-",
            desc: "--",
          },
          uvIndex: {
            value: uvValue,
            desc: uvDesc,
          },
          visibility: {
            value: visibilityValue,
            time: visibilityTime,
          },
          sunrise: "07:55", // static example
          sunset: "15:48",  // static example
          icon: model.symbolCodeIcon ?? "-",
        });
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [cityName]);

  return (
    <div className="card-two">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <h2 className="card-two__title" style={{ margin: 0 }}>
          Today's Highlight
        </h2>
        <span className="card-two__city" style={{ marginLeft: 12 }}>
          — {cityName}
        </span>
      </div>
      {/* Preserve space where icon was, but do not render icon */}
      <div style={{ fontSize: 48, marginBottom: 8, textAlign: "center", height: 56 }}></div>
      {loading && <div style={{ color: "#aaa", fontSize: 13 }}>Loading…</div>}
      {error && <div style={{ color: "#c00", fontSize: 13 }}>Error: {error}</div>}
      <div className="card-two__grid">
        {/* Top Row */}
        <div className="card-two__item">
          <div className="card-two__label">Wind Status</div>
          <div className="card-two__value">{data.wind.value} <span className="card-two__unit">{data.wind.unit}</span></div>
          <div className="card-two__desc">Updated {data.wind.time}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Humidity</div>
          <div className="card-two__value">{data.humidity.value} <span className="card-two__unit">%</span></div>
          <div className="card-two__desc">{data.humidity.desc}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Sunrise</div>
          <div className="card-two__value card-two__icon-value">
            <span role="img" aria-label="sunrise">🌅</span> {data.sunrise}
          </div>
        </div>
        {/* Bottom Row */}
        <div className="card-two__item">
          <div className="card-two__label">UV Index</div>
          <div className="card-two__value">{data.uvIndex.value} <span className="card-two__unit">uv</span></div>
          <div className="card-two__desc">{data.uvIndex.desc}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Visibility</div>
          <div className="card-two__value">{data.visibility.value} <span className="card-two__unit">km</span></div>
          <div className="card-two__desc">Updated {data.visibility.time}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Sunset</div>
          <div className="card-two__value card-two__icon-value">
            <span role="img" aria-label="sunset">🌅</span> {data.sunset}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTwoWidget;
