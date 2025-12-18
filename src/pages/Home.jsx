import "../App.css";

import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import CordOneHeader from "../components/card-one-header/CardOneHeader";
import WeatherCard from "../components/weather-card/WeatherCard";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

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

          <div className="right-column"></div>
        </div>
      </main>
    </div>
  );
}
