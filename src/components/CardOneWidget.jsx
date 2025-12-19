import React from "react";

function CardOneWidget () {
  const weatherData = {
    location: 'Malmö, Sweden',
    day: 'Sunday',
    date: '17 Dec, 2025',
    temp: 28,
    tempLow: 24,
    condition: 'Heavy Rain',
    feelsLike: 31,
    icon: '🌧️'
  }

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="location">
          <span className="location-icon">📍</span>
          <span>{weatherData.location}</span>
        </div>
      </div>
      
      <div className="weather-card-body">
        <div className="weather-info">
          <h2 className="day">{weatherData.day}</h2>
          <p className="date">{weatherData.date}</p>
          <div className="weather-icon">{weatherData.icon}</div>
          <p className="condition">{weatherData.condition}</p>
          <p className="feels-like">Feels like {weatherData.feelsLike}°</p>
        </div>
        
        <div className="temperature">
          <span className="temp-main">{weatherData.temp}°C</span>
          <span className="temp-low">/{weatherData.tempLow}°C</span>
        </div>
      </div>
    </div>
  )
};

export default CardOneWidget;
