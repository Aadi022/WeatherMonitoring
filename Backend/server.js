const express = require('express');
const mongoose = require('mongoose');
const cors= require("cors");
const cron = require('node-cron');
const weatherRoutes = require("./Routes/weatherRoutes.js");
const fetchWeatherData = require("./Controllers/weatherController.js").fetchWeatherData;

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const db = require('./config/db');
db();

// Routes
app.use('/api/weather', weatherRoutes);


// Schedule weather data fetch every 5 minutes
cron.schedule('*/5 * * * *', fetchWeatherData);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
