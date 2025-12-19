import "./CardTwoWidget.css";
import React from "react";

const CardTwoWidget = ({ wind, humidity, uvIndex, visibility, sunrise, sunset }) => {
  return (
    <div className="card-two">
      <h2 className="card-two__title">Today's Highlight</h2>
      <div className="card-two__grid">
        {/* Top Row */}
        <div className="card-two__item">
          <div className="card-two__label">Wind Status</div>
          <div className="card-two__value">{wind.value} <span className="card-two__unit">{wind.unit}</span></div>
          <div className="card-two__desc">Updated {wind.time}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Humidity</div>
          <div className="card-two__value">{humidity.value} <span className="card-two__unit">%</span></div>
          <div className="card-two__desc">{humidity.desc}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Sunrise</div>
          <div className="card-two__value card-two__icon-value">
            <span role="img" aria-label="sunrise">🌅</span> {sunrise}
          </div>
        </div>
        {/* Bottom Row */}
        <div className="card-two__item">
          <div className="card-two__label">UV Index</div>
          <div className="card-two__value">{uvIndex.value} <span className="card-two__unit">uv</span></div>
          <div className="card-two__desc">{uvIndex.desc}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Visibility</div>
          <div className="card-two__value">{visibility.value} <span className="card-two__unit">km</span></div>
          <div className="card-two__desc">Updated {visibility.time}</div>
        </div>
        <div className="card-two__item">
          <div className="card-two__label">Sunset</div>
          <div className="card-two__value card-two__icon-value">
            <span role="img" aria-label="sunset">🌅</span> {sunset}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTwoWidget;
