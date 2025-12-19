import CityRowCard from "./CityRowCard";
import "./card4.css";

/* List of Swedish cities to show in the card */
const swedenCities = [
  { region: "Sweden", city: "Malmö", desc: "Mostly Sunny", hi: 19, lo: 12, icon: "🌤️" },
  { region: "Sweden", city: "Lund", desc: "Cloudy", hi: 18, lo: 11, icon: "☁️" },
  { region: "Sweden", city: "Helsingborg", desc: "Rain", hi: 16, lo: 10, icon: "🌧️" },
  { region: "Sweden", city: "Stockholm", desc: "Sunny", hi: 20, lo: 13, icon: "☀️" },

  /* Extra cities added to test scroll */
  { region: "Sweden", city: "Gothenburg", desc: "Windy", hi: 17, lo: 10, icon: "💨" },
  { region: "Sweden", city: "Uppsala", desc: "Fog", hi: 15, lo: 9, icon: "🌫️" },
];

export default function Card4OtherCities() {
  return (
    <section className="card4">
      {/* Card header */}
      <header className="card4__header">
        <h2 className="card4__title">Other Cities</h2>

        {/* See all button (UI only for now) */}
        <button className="card4__seeAll" type="button">
          See All <span className="card4__chev">▾</span>
        </button>
      </header>

      {/* Scrollable list of cities */}
      <div className="card4__list">
        {swedenCities.map((city) => (
          <CityRowCard key={city.city} data={city} />
        ))}
      </div>
    </section>
  );
}
