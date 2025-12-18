import Card4OtherCities from "../components/Card4OtherCities/Card4OtherCities";

export default function Home() {
  return (
    <div className="homePage">
      <div className="homeLeft">
        <h1 className="homeTitle">Home page</h1>

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
