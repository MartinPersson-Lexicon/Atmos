export default function CityRowCard({ data }) {
  const { region, city, desc, temp, icon } = data;

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
        <span className="cityRow__temp">{temp ?? "—"}°</span>
      </div>
    </article>
  );
}
