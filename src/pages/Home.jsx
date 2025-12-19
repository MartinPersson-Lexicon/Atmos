import "../App.css";


import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import CordOneHeader from "../components/card-one-header/CardOneHeader";
import WeatherCard from "../components/weather-card/WeatherCard";
import CardTwoWidget from "../components/CardTwoWidget";
import WeatherModel from "../models/WeatherModel";
import { SMHI_PARAMETERS_MAP } from "../models/SMHIParameters";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

  // Example: Map WeatherModel and SMHI_PARAMETERS_MAP to CardTwo props

  // Convert wind speed from m/s to km/h (1 m/s = 3.6 km/h)
  const windValue = (WeatherModel.Vindhastighet * 3.6).toFixed(1);
  const windUnit = 'km/h';
  const humidityValue = WeatherModel.RelativLuftfuktighet;
  const humidityUnit = '%';
  // UV index and visibility are not in your model, so use placeholders or extend your model as needed
  const uvIndexValue = 4; // Placeholder
  const uvIndexDesc = 'Moderate UV'; // Placeholder
  const visibilityValue = 5; // Placeholder (km)
  const visibilityTime = '09:00'; // 24h format
  const sunrise = '04:50'; // 24h format
  const sunset = '18:45'; // 24h format

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="main-content">
        <CordOneHeader
          theme={theme}
          setTheme={setTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="content-grid">
          <div className="left-column">
            <WeatherCard />
          </div>

          <div className="right-column">
            <CardTwoWidget
              wind={{ value: windValue, unit: windUnit, time: visibilityTime }}
              humidity={{ value: humidityValue, desc: 'Humidity is good' }}
              uvIndex={{ value: uvIndexValue, desc: uvIndexDesc }}
              visibility={{ value: visibilityValue, time: visibilityTime }}
              sunrise={sunrise}
              sunset={sunset}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
