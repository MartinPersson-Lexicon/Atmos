import { useState } from "react";
import "../App.css";
import "../Dashboard.css";
import CardOneWidget from "../components/card-one/CardOneWidget";
import CardTwoWidget from "../components/card-two/CardTwoWidget";
import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
import Card3Forecast from "../components/Card3Forecast/Card3Forecast";

export default function Home() {
  // Shared city state for Card 1 + Card 3
  const [selectedCity, setSelectedCity] = useState("Malmö");

  // Get current time in 24-hour format (HH:mm)
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const timeString = `${hours}:${minutes}`;

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-main">
          <div className="left-column">
            <CardOneWidget
              cityName={selectedCity}
              onCityChange={setSelectedCity}
            />
            <Card4OtherCities />
          </div>

          <div className="right-column">
            <CardTwoWidget cityName={selectedCity} />

            <Card3Forecast cityName={selectedCity} />
          </div>
        </div>
      </div>

      <div className="homeRight">
        {/* Right side is empty for now (other cards will go here later) */}
      </div>
    </>
  );
}
