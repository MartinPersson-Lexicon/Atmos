import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";
import CardOneWidget from "../components/card-one/CardOneWidget";
export default function Home() {
  // const [theme, setTheme] = useState("dark");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeNav, setActiveNav] = useState("dashboard");

  return (
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
  );
}
