import WeatherWidget from "../components/ApiTestWidget";
import "../App.css";

export default function ApiTest() {

  return (
    <div className="page weather-page">
      <h2>API test page</h2>
     
      <WeatherWidget />
    </div>
  );
}
