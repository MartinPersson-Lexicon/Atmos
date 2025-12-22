import ApiTestWidget from "../components/api-test-components/ApiTestWidget";
import ApiTestListWidget from "../components/api-test-components/ApiTestListWidget";
import "../App.css";

export default function ApiTest() {
  return (
    <div className="page weather-page">
      <h2>API test page</h2>
      <p>------------------------------------</p>
      <ApiTestWidget />
      <p>------------------------------------</p>
      <ApiTestListWidget />
      <p>------------------------------------</p>
    </div>
  );
}
