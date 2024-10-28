import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Kolkata from './City/Kolkata.jsx';
import Mumbai from './City/Mumbai.jsx';
import Chennai from './City/Chennai.jsx';
import Delhi from './City/Delhi.jsx';
import Bangalore from './City/Bangalore.jsx';
import Hyderabad from './City/Hyderabad.jsx';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [weatherData, setWeatherData] = useState([]);

  // Fetch weather rollup data from the backend
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/weather/rollups");  // Backend endpoint
        
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setWeatherData(response.data);  // Store the response data in state
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching weather rollups:', error);
      }
    };

    fetchWeatherData();
  }, []);

  // Return early if the data is not loaded or it's not an array
  if (!Array.isArray(weatherData) || weatherData.length === 0) {
    return <div>Loading...</div>;
  }

  // Prepare chart data for Chart.js
  const chartData = {
    labels: weatherData.map((item) => item.city), // City names as labels
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: weatherData.map((item) => item.avgTemp), // Average temperature for each city
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Max Temperature (°C)',
        data: weatherData.map((item) => item.maxTemp), // Max temperature for each city
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Min Temperature (°C)',
        data: weatherData.map((item) => item.minTemp), // Min temperature for each city
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      }
    ]
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul>
          <li><Link to="/kolkata">Kolkata</Link></li>
          <li><Link to="/mumbai">Mumbai</Link></li>
          <li><Link to="/chennai">Chennai</Link></li>
          <li><Link to="/delhi">Delhi</Link></li>
          <li><Link to="/bangalore">Bangalore</Link></li>
          <li><Link to="/hyderabad">Hyderabad</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={
          <div>
            <h1>Daily Weather Rollups</h1>
            <Line key={JSON.stringify(chartData)} data={chartData} />
          </div>
        } />
        <Route path="/kolkata" element={<Kolkata />} />
        <Route path="/mumbai" element={<Mumbai />} />
        <Route path="/chennai" element={<Chennai />} />
        <Route path="/delhi" element={<Delhi />} />
        <Route path="/bangalore" element={<Bangalore />} />
        <Route path="/hyderabad" element={<Hyderabad />} />
      </Routes>
    </div>
  );
};

export default App;
