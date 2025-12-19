import "../App.css";


import { useState } from "react";
import Sidebar from "../components/sidebar-folder/Sidebar";
import CardOneWidget from "../components/card-one/CardOneWidget";
// import WeatherCard from "../components/weather-card/WeatherCard";
import CardTwoWidget from "../components/CardTwoWidget";
import WeatherModel from "../models/WeatherModel";
import { SMHI_PARAMETERS_MAP } from "../models/SMHIParameters";

import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
// import CardOneWidget from "../components/card-one/CardOneWidget";
export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

  // Example: Map WeatherModel and SMHI_PARAMETERS_MAP to CardTwo props

  // Convert wind speed from m/s to km/h (1 m/s = 3.6 km/h)
  const windValue = (WeatherModel.Vindhastighet * 3.6).toFixed(1);
  const windUnit = 'km/h';
  const humidityValue = WeatherModel.RelativLuftfuktighet;
  // const humidityUnit = '%';
  // UV index and visibility are not in your model, so use placeholders or extend your model as needed
  const uvIndexValue = 4; // Placeholder
  const uvIndexDesc = 'Moderate UV'; // Placeholder
  const visibilityValue = 5; // Placeholder (km)
  const visibilityTime = '09:00'; // 24h format
  const sunrise = '04:50'; // 24h format
  const sunset = '18:45'; // 24h format
  // const [theme, setTheme] = useState("dark");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="main-content">
        <CardOneWidget
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
    <div className="homePage">
      <div className="homeLeft">
        <h1 className="homeTitle">Home page</h1>

        <div className="left-column">
          <CardOneWidget />
        </div>
        <div className="right-column"></div>

        {/* Card4 should be in the left-bottom area */}
        <div className="leftBottom">
          <Card4OtherCities />
        </div>
      </div>

      <div className="homeRight">
        {/* Right side is empty for now (other cards will go here later) */}
      </div>
    </div>

        </div>
      </main>
    </div>
  );
}
