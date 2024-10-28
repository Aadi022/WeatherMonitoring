const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now },
  avgTemp: Number,
  feelsLike: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
  weatherConditions: [String],
  entryCount: { type: Number, default: 0 },
  maxThreshold: { type: Number, default: 35 },
  minThreshold: { type: Number, default: 15 },
  humidity: Number,  // New field for humidity
  windSpeed: Number, // New field for wind speed
});

module.exports = mongoose.model('Weather', weatherSchema);
