import "./CardOneWidget.css";

// Add style for visually hidden select value but visible dropdown options
const selectStyle = {
  background: "transparent",
  color: "transparent",
  border: "none",
  fontSize: 18,
  padding: 0,
  margin: 0,
  outline: "none",
  opacity: 1,
  width: "100%",
  height: "100%",
  position: "absolute",
  left: 0,
  top: 0,
  cursor: "pointer",
  zIndex: 2,
  appearance: "none",
  MozAppearance: "none",
  WebkitAppearance: "none",
};

import { useEffect, useState } from "react";
import weatherApi from "../../api/weatherApi";
import { SMHI_CITY_MODELS } from "../../models/cityModel";

// Card4 icon logic
function iconFromWeatherCode(code, fallbackIcon = "❓") {
  const n = Number(code);
  if (!Number.isFinite(n)) return fallbackIcon;
  if (n >= 90 && n <= 99) return "⛈️";
  if (n >= 70 && n <= 79) return "🌨️";
  if ((n >= 50 && n <= 69) || (n >= 80 && n <= 86)) return "🌧️";
  if ((n >= 10 && n <= 19) || (n >= 40 && n <= 49)) return "🌫️";
  if (n >= 4 && n <= 9) return "☁️";
  if (n >= 0 && n <= 3) return "☀️";
  return fallbackIcon;
}

// NOTE: only small change here: added onCityChange
function CardOneWidget({ cityName = "Malmö", onCityChange }) {
  const [selectedCity, setSelectedCity] = useState(cityName);
  const [weatherData, setWeatherData] = useState({
    location: `${cityName}, Sweden`,
    day: "Sunday",
    date: "17 Dec, 2025",
    temp: 28,
    condition: "Heavy Rain",
    icon: "🌧️",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // If parent changes cityName, keep local selectedCity in sync
  useEffect(() => {
    setSelectedCity(cityName);
  }, [cityName]);

  const fetchWeather = async (cityArg) => {
    const city = typeof cityArg === "string" ? cityArg : selectedCity;
    setLoading(true);
    setError(null);
    try {
      const found = SMHI_CITY_MODELS.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
      const stationId = found ? found.stationId : 52350;
      const model = await weatherApi.populateWeatherModelFromStationId(
        stationId
      );
      setWeatherData({
        location: `${city}, Sweden`,
        day: model.dateTime
          ? new Date(model.dateTime).toLocaleDateString("en-GB", {
              weekday: "long",
            })
          : "-",
        date: model.dateTime
          ? new Date(model.dateTime).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
        temp: model.temperature ?? "-",
        condition: model.weatherText ?? "-",
        icon:
          model.symbolCodeIcon || iconFromWeatherCode(model.weatherCode, "🌧️"),
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  return (
    <div className="weather-card">
      <div
        className="weather-card-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 48,
        }}
      >
        <div
          className="location"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span className="location-icon">📍</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {selectedCity}
          </span>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 4,
              cursor: loading ? "not-allowed" : "pointer",
              position: "relative",
              height: 28,
              width: 28,
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: "#fff",
                marginLeft: 2,
                marginRight: 2,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              ▼
            </span>
            <select
              value={selectedCity}
              onChange={(e) => {
                const newCity = e.target.value;
                setSelectedCity(newCity); // update Card 1
                if (onCityChange) onCityChange(newCity); // notify Home -> Card3
              }}
              style={selectStyle}
              disabled={loading}
              aria-label="Select city"
              className="city-dropdown-select"
            >
              {SMHI_CITY_MODELS.map((city) => (
                <option
                  key={city.stationId}
                  value={city.city}
                  style={{ color: "#222" }}
                >
                  {city.city}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.55)",
            fontSize: 13,
            cursor: loading ? "not-allowed" : "pointer",
            marginLeft: 8,
            padding: "4px 8px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
          onClick={() => fetchWeather(selectedCity)}
          disabled={loading}
          aria-label="Refresh weather"
        >
          {loading ? "Updating…" : "Refresh"}
          <span style={{ fontSize: 18, marginLeft: 4 }}>↻</span>
        </button>
      </div>

      <div className="weather-card-body">
        <div className="weather-info">
          <h2 className="day">{weatherData.day}</h2>
          <p className="date">{weatherData.date}</p>
          <div className="weather-icon">{weatherData.icon}</div>
          <p className="condition">{weatherData.condition}</p>
        </div>

        <div className="temperature">
          <span className="temp-main">{weatherData.temp}°C</span>
        </div>
      </div>
      {lastUpdated && (
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
          Last update:{" "}
          {lastUpdated.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
      {error && (
        <div style={{ color: "#c00", marginTop: 8 }}>Error: {error}</div>
      )}
    </div>
  );
}

export default CardOneWidget;
