import "../App.css";
import "../Dashboard.css";
import CardOneWidget from "../components/card-one/CardOneWidget";
import CardTwoWidget from "../components/card-two/CardTwoWidget";
import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";

export default function Home() {
  // Get current time in 24-hour format (HH:mm)
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const timeString = `${hours}:${minutes}`;

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <div className="left-column">
          <CardOneWidget />
          <Card4OtherCities />
        </div>
        <div className="right-column">
          <CardTwoWidget
            wind={{ value: 7.9, unit: 'km/h', time: timeString }}
            humidity={{ value: 85, desc: 'Humidity is good' }}
            uvIndex={{ value: 4, desc: 'Moderate UV' }}
            visibility={{ value: 5, time: timeString }}
            sunrise={'4:50 AM'}
            sunset={'6:45 PM'}
          />
          {/* Add 10 Day Forecast here if you have it */}
        </div>
      </div>
    </div>
  );
}
