import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from 'node-fetch';

// Weather API response interfaces
interface WeatherSummaryResponse {
  temp: number;
  condition: string;
  highTemp: number;
  lowTemp: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API specific routes (must be defined BEFORE the parameterized route)
  
  // Weather summary endpoint for city table
  app.get('/api/weather-summary', async (req: Request, res: Response) => {
    try {
      const { city, country } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
      }

      // Get API key from environment
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Weather API key not configured' });
      }

      // Clean up the city name
      const cleanCityName = String(city).replace(/['"]/g, '').trim();
      
      // Build the location query - add country code if available
      const locationQuery = country ? `${cleanCityName},${country}` : cleanCityName;
      
      // Build API URL
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationQuery)}&units=metric&appid=${apiKey}`;
      
      // Fetch data from OpenWeatherMap
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `Failed to fetch weather data: ${response.statusText}`
        });
      }

      const data = await response.json();
      
      // Return simplified weather summary
      const weatherSummary: WeatherSummaryResponse = {
        temp: data.main.temp,
        condition: data.weather[0].main,
        highTemp: data.main.temp_max,
        lowTemp: data.main.temp_min
      };
      
      res.json(weatherSummary);
    } catch (error) {
      console.error('Error in weather API:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  // Weather API endpoint - Detailed weather and forecast
  app.get('/api/weather-detail', async (req: Request, res: Response) => {
    try {
      const { city, country } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
      }

      // Get API key from environment
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Weather API key not configured' });
      }

      // Clean up the city name
      const cleanCityName = String(city).replace(/['"]/g, '').trim();
      
      // Build the location query - add country code if available
      const locationQuery = country ? `${cleanCityName},${country}` : cleanCityName;
      
      // Build API URLs for current weather and forecast
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationQuery)}&units=metric&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(locationQuery)}&units=metric&appid=${apiKey}`;
      
      // Fetch both current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
      ]);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        return res.status(currentResponse.ok ? forecastResponse.status : currentResponse.status).json({ 
          error: `Failed to fetch weather data: ${currentResponse.ok ? forecastResponse.statusText : currentResponse.statusText}`
        });
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      // Return combined data
      res.json({
        current: currentData,
        forecast: forecastData
      });
    } catch (error) {
      console.error('Error in weather API:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  // Add the cached weather data route at the end, since it uses path parameters
  app.get('/api/weather/:city', async (req: Request, res: Response) => {
    try {
      const city = req.params.city;
      const cachedData = await storage.getWeatherByCity(city);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData.data));
      }
      
      // If no cached data, return 404
      return res.status(404).json({ message: 'Weather data not found for this city' });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return res.status(500).json({ message: 'Failed to fetch weather data' });
    }
  });
  
  // API route to cache weather data
  app.post('/api/weather', async (req: Request, res: Response) => {
    try {
      const { cityName, data } = req.body;
      
      if (!cityName || !data) {
        return res.status(400).json({ message: 'City name and weather data are required' });
      }
      
      // Store weather data in cache
      const weatherCache = await storage.cacheWeatherData({
        cityName,
        data: JSON.stringify(data),
        timestamp: new Date(),
      });
      
      return res.status(201).json({ message: 'Weather data cached successfully' });
    } catch (error) {
      console.error('Error caching weather data:', error);
      return res.status(500).json({ message: 'Failed to cache weather data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
