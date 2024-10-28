import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../App.css";
const Delhi = () => {
  const [weather, setWeather] = useState(null);
  const [maxThreshold, setMaxThreshold] = useState(35);  // Default max threshold
  const [minThreshold, setMinThreshold] = useState(15);  // Default min threshold

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/weather/rollups');
        const cityWeather = response.data.find(w => w.city === 'Delhi');
        setWeather(cityWeather);
        setMaxThreshold(cityWeather.maxThreshold);
        setMinThreshold(cityWeather.minThreshold);

        // Check if the temperatures exceed the thresholds and alert the user
        if (cityWeather.maxTemp > cityWeather.maxThreshold) {
          alert(`ALERT: The temperature in Delhi is above the max threshold of ${cityWeather.maxThreshold}°C! Current temp: ${cityWeather.maxTemp.toFixed(2)}°C`);
        }
        if (cityWeather.minTemp < cityWeather.minThreshold) {
          alert(`ALERT: The temperature in Delhi is below the min threshold of ${cityWeather.minThreshold}°C! Current temp: ${cityWeather.minTemp.toFixed(2)}°C`);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleThresholdUpdate = async () => {
    try {
      await axios.post('http://localhost:3000/api/weather/update-thresholds', {
        city: 'Delhi',
        maxThreshold,
        minThreshold
      });
      // Removed the alert after updating the threshold
    } catch (error) {
      console.error('Error updating thresholds:', error);
    }
  };

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <div className="weather-container">
      <h2>Weather in Delhi</h2>
      <p><strong>Main Condition:</strong> {weather.dominantCondition}</p>
      <p><strong>Current Temperature:</strong> {weather.avgTemp.toFixed(2)}°C</p>
      <p><strong>Feels Like:</strong> {weather.feelsLike.toFixed(2)}°C</p>
      <p><strong>Max Temperature:</strong> {weather.maxTemp.toFixed(2)}°C</p>
      <p><strong>Min Temperature:</strong> {weather.minTemp.toFixed(2)}°C</p>
      <p><strong>Humidity:</strong> {weather.humidity}%</p>  {/* Displaying humidity */}
      <p><strong>Wind Speed:</strong> {weather.windSpeed} m/s</p>  {/* Displaying wind speed */}

      <div className="thresholds">
        <h3>Update Thresholds</h3>
        <label>
          Max Threshold:
          <input
            type="number"
            value={maxThreshold}
            onChange={(e) => setMaxThreshold(e.target.value)}
          />
        </label>
        <label>
          Min Threshold:
          <input
            type="number"
            value={minThreshold}
            onChange={(e) => setMinThreshold(e.target.value)}
          />
        </label>
        <button onClick={handleThresholdUpdate}>Update Thresholds</button>
      </div>
    </div>
  );
};

export default Delhi;
