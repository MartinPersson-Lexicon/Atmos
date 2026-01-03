import "../App.css";

export default function About() {
  return (
    <div className="page about">
      <h2>Meet the team:</h2>
      <p>&nbsp;</p>
      <h3>Mojdeh Beyzavi, Alisher Kayumov and Martin Persson </h3>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <h2>The project:</h2>
      <p>&nbsp;</p>

      <h3>
        To collaborate and create a frontend web application with free choice of
        technology.
      </h3>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <h2>Chosen tech stack:</h2>
      <p>&nbsp;</p>

      <h3>
        Frontend with React.js. CSS and Bootstrap for styling. Api-layer in
        JavaScript.
      </h3>
      <h3>
        Api calls to external weather service SMHI Open Data API's. At:&nbsp;
        <a
          href="https://opendata.smhi.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="external-link"
        >
          https://opendata.smhi.se/
        </a>
      </h3>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <h2>Results (clockwise from top left):</h2>
      <p>&nbsp;</p>

      <h3>Card1: Selected city, latest-hour weather data</h3>
      <h3>Card2: Selected city, latest-hour expanded weather data</h3>
      <h3>Card3: Selected city, 10-day weather forecast</h3>
      <h3>Card4: All cities latest-hour weather data </h3>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <h3>Special thanks to:</h3>
      <h4>SMHI Open Data for weather data.</h4>
      <h4>Flaticon.com for some nice icons.</h4>
      <h4>Freepik.com for some nice background videos.</h4>
    </div>
  );
}
