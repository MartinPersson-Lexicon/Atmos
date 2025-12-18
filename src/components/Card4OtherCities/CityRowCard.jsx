export default function CityRowCard({ data }) {
  const { region, city, desc, hi, lo, icon } = data;

  return (
    <article className="cityRow">
      <div className="cityRow__left">
        <div className="cityRow__region">{region}</div>
        <div className="cityRow__city">{city}</div>
        <div className="cityRow__desc">{desc}</div>
      </div>

      <div className="cityRow__mid" aria-hidden="true">
        <span className="cityRow__icon">{icon}</span>
      </div>

      <div className="cityRow__right">
        <span className="cityRow__hi">{hi}°</span>
        <span className="cityRow__slash">/</span>
        <span className="cityRow__lo">{lo}°</span>
      </div>
    </article>
  );
}
