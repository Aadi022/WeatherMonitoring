const axios = require('axios');
const Weather = require("../Models/Weather.js");
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const apiKey = '035f09528b5627280644d4ce52db1076';

// Helper function to convert temperatures
const convertTemperature = (tempInCelsius, unit) => {
  switch (unit) {
    case 'fahrenheit':
      return (tempInCelsius * 9/5) + 32;
    case 'kelvin':
      return tempInCelsius + 273.15;
    default:
      return tempInCelsius;
  }
};

// Helper function to check and log temperature alerts
const checkTemperatureAlerts = (city, temp, maxThreshold, minThreshold) => {
  if (temp > maxThreshold) {
    console.log(`ALERT: The temperature in ${city} is above the max threshold! Current temp: ${temp}°C, Threshold: ${maxThreshold}°C.`);
  }
  if (temp < minThreshold) {
    console.log(`ALERT: The temperature in ${city} is below the min threshold! Current temp: ${temp}°C, Threshold: ${minThreshold}°C.`);
  }
};

// Fetch and store weather data for all cities every 5 minutes
const fetchWeatherData = async () => {
  try {
    for (let city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const tempInKelvin = response.data.main.temp;
      const tempInCelsius = tempInKelvin - 273.15;
      const feelsLikeInKelvin = response.data.main.feels_like;
      const feelsLikeInCelsius = feelsLikeInKelvin - 273.15;
      const condition = response.data.weather[0].main;

      // New values for humidity and wind speed
      const humidity = response.data.main.humidity;  // Extract humidity
      const windSpeed = response.data.wind.speed;  // Extract wind speed

      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let existingData = await Weather.findOne({ city, date: today });

      if (existingData) {
        // Update existing weather data for the current day
        existingData.maxTemp = Math.max(existingData.maxTemp, tempInCelsius);
        existingData.minTemp = Math.min(existingData.minTemp, tempInCelsius);
        existingData.avgTemp = (existingData.avgTemp * existingData.entryCount + tempInCelsius) / (existingData.entryCount + 1);
        existingData.feelsLike = (existingData.feelsLike * existingData.entryCount + feelsLikeInCelsius) / (existingData.entryCount + 1);
        existingData.weatherConditions.push(condition);
        existingData.humidity = humidity;  // Update humidity
        existingData.windSpeed = windSpeed;  // Update wind speed
        existingData.entryCount += 1;

        await existingData.save();

        // Check and log temperature alerts
        checkTemperatureAlerts(city, tempInCelsius, existingData.maxThreshold, existingData.minThreshold);
      } else {
        // Create new weather entry
        const weatherData = new Weather({
          city,
          date: today,
          avgTemp: tempInCelsius,
          feelsLike: feelsLikeInCelsius,
          maxTemp: tempInCelsius,
          minTemp: tempInCelsius,
          dominantCondition: condition,
          weatherConditions: [condition],
          entryCount: 1,
          humidity,  // Store humidity
          windSpeed, // Store wind speed
        });

        await weatherData.save();

        // Check and log temperature alerts
        checkTemperatureAlerts(city, tempInCelsius, weatherData.maxThreshold, weatherData.minThreshold);
      }
    }

    console.log('Weather data fetched and updated');
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Update threshold values for a city
const updateThresholds = async (req, res) => {
  const { city, maxThreshold, minThreshold } = req.body;

  try {
    let weatherData = await Weather.findOne({ city });
    if (weatherData) {
      weatherData.maxThreshold = maxThreshold;
      weatherData.minThreshold = minThreshold;
      await weatherData.save();
      res.json({ message: `Thresholds updated for ${city}.` });
    } else {
      res.status(404).json({ message: 'City not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating thresholds', error });
  }
};

// Get rollups with temperature conversion
const getDailyRollups = async (req, res) => {
  try {
    let unit = req.query.unit || 'celsius';

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const weatherData = await Weather.find({ date: today });

    const convertedData = weatherData.map(cityData => {
      return {
        city: cityData.city,
        avgTemp: convertTemperature(cityData.avgTemp, unit),
        feelsLike: convertTemperature(cityData.feelsLike, unit),
        maxTemp: convertTemperature(cityData.maxTemp, unit),
        minTemp: convertTemperature(cityData.minTemp, unit),
        dominantCondition: cityData.dominantCondition,
        maxThreshold: cityData.maxThreshold,
        minThreshold: cityData.minThreshold,
        humidity: cityData.humidity,  // Include humidity
        windSpeed: cityData.windSpeed,  // Include wind speed
      };
    });

    res.json(convertedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily rollups', error });
  }
};

module.exports = { fetchWeatherData, getDailyRollups, updateThresholds };
