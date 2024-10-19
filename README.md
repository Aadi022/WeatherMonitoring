# Real-Time Weather Monitoring System

## Overview
This project is a **Real-Time Data Processing System for Weather Monitoring**. It continuously fetches weather data for six metro cities in India from the **OpenWeatherMap API**, processes it, and provides daily summaries and alerts based on weather conditions. The system rolls up weather data into daily aggregates, tracks thresholds for alerting purposes, and delivers real-time weather insights.

## Key Features

1. **Real-Time Weather Data Retrieval**:
   - Retrieves weather data every 5 minutes from the **OpenWeatherMap API**.
   - Monitors key weather parameters including:
     - **Temperature** (current, min, max)
     - **Feels like temperature**
     - **Humidity**
     - **Wind speed**
     - **Main weather condition** (e.g., clear, rain, snow).

2. **Daily Rollups and Aggregates**:
   - For each city, the system generates a daily summary that includes:
     - **Average temperature** throughout the day.
     - **Maximum and minimum temperatures** for the day.
     - **Dominant weather condition** (based on the most frequent weather type).
     - **Humidity levels** and **wind speed** trends.
   - These summaries are stored in a **MongoDB** database for historical tracking and analysis.

3. **User-Defined Thresholds for Alerts**:
   - Allows users to configure **maximum** and **minimum temperature thresholds** for each city.
   - If the temperature exceeds or falls below these thresholds, alerts are generated and logged in the console.
   - The system also monitors **humidity** and **wind speed**, offering the ability to extend alert functionality to these parameters.

4. **Temperature Conversion**:
   - All temperature data from OpenWeather is converted from **Kelvin to Celsius**.
   - The system supports user preferences to convert temperatures to **Fahrenheit**, providing flexibility for different users.

5. **Humidity and Wind Speed Insights**:
   - Tracks **humidity** levels and **wind speed** for each city.
   - These metrics are included in daily summaries, offering additional insight into the day’s weather conditions.

6. **Data Persistence**:
   - The system stores daily weather summaries, including all rollups, aggregates, and triggered alerts, in **MongoDB** for long-term storage and analysis.

## API Endpoints

### 1. **GET /api/weather/rollups**
Retrieves the daily rollups for all cities, including average, minimum, maximum temperatures, humidity, wind speed, and dominant weather condition.

### 2. **POST /api/weather/update-thresholds**
Allows users to set **max** and **min temperature thresholds** for each city.

### 3. **Scheduled Cron Job (Every 5 Minutes)**
Fetches weather data for all cities, updates the database, and checks if any temperature thresholds are breached.

---

This project provides a comprehensive solution for monitoring weather data in real time, storing daily rollups, and generating alerts based on user-defined thresholds.
