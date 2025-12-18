import WeatherWidget from "../components/WeatherWidget";
import "../App.css";

export default function Weather() {
  // Example coords: Stockholm
  const lat = 59.33;
  const lon = 18.06;

  return (
    <div className="page weather-page">
      <h2>Weather</h2>
      <p>
        Showing nearest station data for coordinates {lat}, {lon}.
      </p>
      <WeatherWidget lat={lat} lon={lon} parameter="1" />
    </div>
  );
}
