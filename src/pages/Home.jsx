import { useState } from "react";
import "../App.css";
import "../Dashboard.css";
import CardOneWidget from "../components/card-one/CardOneWidget";
import CardTwoWidget from "../components/card-two/CardTwoWidget";
import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
import Card3Forecast from "../components/Card3Forecast/Card3Forecast";

export default function Home() {
  // Shared selected city for Card 1, Card 2 and Card 3
  const [selectedCity, setSelectedCity] = useState("Malmö");

  // Current time string used in Card 2 props (HH:mm)
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const timeString = `${hours}:${minutes}`;

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-main">
          {/* Row 1 – left: Card 1 */}
          <div className="dashboard-cell dashboard-cell--card1">
            <CardOneWidget
              cityName={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>

          {/* Row 1 – right: Card 2 */}
          <div className="dashboard-cell dashboard-cell--card2">
            <CardTwoWidget
              cityName={selectedCity}
              wind={{ value: 3.9, unit: "m/s", time: timeString }}
              humidity={{ value: 59, desc: "" }}
              uvIndex={{ value: null, desc: "uv" }}
              visibility={{ value: 89.7, time: timeString }}
              sunrise={"--"}
              sunset={"--"}
            />
          </div>

          {/* Row 2 – left: Card 4 (Other Cities) */}
          <div className="dashboard-cell dashboard-cell--card4">
            <Card4OtherCities />
          </div>

          {/* Row 2 – right: Card 3 (10 Day Forecast) */}
          <div className="dashboard-cell dashboard-cell--card3">
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
