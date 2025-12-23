import "./card3.css";

// Card 3: 10-day forecast (UI first). Data is dummy for now; will connect to SMHI later.
export default function Card3Forecast({ cityName = "Malmö" }) {
  // Temporary mock values just to match the design + layout.
  // I will Replace this array with real forecast data once the API layer is ready.
  const days = [
    { label: "Today", icon: "🌧️", temp: 6 },
    { label: "Mon", icon: "🌤️", temp: 7 },
    { label: "Tue", icon: "🌧️", temp: 5 },
    { label: "Wed", icon: "⛈️", temp: 4 },
    { label: "Thu", icon: "🌤️", temp: 6 },
  ];

  return (
    <section className="card3">
      <header className="card3__header">
        <h2 className="card3__title">
          10 Day Forecast <span className="card3__city">— {cityName}</span>
        </h2>
      </header>

      <div className="card3__days">
        {days.map((d) => (
          <article key={d.label} className="card3Day">
            <div className="card3Day__label">{d.label}</div>

            <div className="card3Day__icon" aria-hidden="true">
              {d.icon}
            </div>

            <div className="card3Day__temp">{d.temp}°C</div>
          </article>
        ))}
      </div>
    </section>
  );
}
