import { 
  CityApiResponse, 
  CityTableData, 
  WeatherApiResponse, 
  ForecastApiResponse, 
  WeatherData, 
  DailyForecast,
  ForecastItem 
} from '@/types';
import { format } from 'date-fns';

// OpenWeatherMap API key from environment variable
// In Vite, we access environment variables through import.meta.env
// Environment variables must be prefixed with VITE_ to be exposed to the client
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 'cf55bdbc94dd39e898c4bf4d18024828';

/**
 * Fetches cities from the OpenDataSoft API
 * @param searchTerm - Optional search term for filtering cities
 * @param start - Pagination start index
 * @param rows - Number of rows to fetch
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order ('asc' or 'desc')
 */
export async function fetchCities(
  searchTerm: string = '',
  start: number = 0,
  rows: number = 20,
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
  includeWeather: boolean = true
): Promise<CityTableData[]> {
  try {
    // Construct search query
    let query = '';
    if (searchTerm) {
      query = `&q=${encodeURIComponent(searchTerm)}`;
    }

    // Format the sort parameter with direction prefix
    const formattedSort = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
    
    // Build the API URL - this API uses hyphen prefix for desc order
    const apiUrl = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&start=${start}&rows=${rows}${query}&sort=${formattedSort}&facet=cou_name_en`;
    console.log('Fetching cities from:', apiUrl);

    // Use fetch to get data from the API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data: CityApiResponse = await response.json();
    console.log('Received city data:', data.nhits, 'total records, fetched', data.records.length);
    
    if (!data.records || !Array.isArray(data.records)) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    // Transform data to our CityTableData format
    const cities = data.records.map(record => {
      if (!record.fields) {
        console.warn('Record missing fields:', record);
        return {
          id: record.recordid || 'unknown',
          name: 'Unknown City',
          country: 'Unknown Country',
          countryCode: 'XX',
          population: 0,
          timezone: 'Unknown',
          coordinates: [0, 0] as [number, number],
          currentTemp: undefined,
          currentCondition: undefined,
          highTemp: undefined,
          lowTemp: undefined
        };
      }
      
      return {
        id: record.recordid,
        name: record.fields.name,
        country: record.fields.cou_name_en,
        countryCode: record.fields.country_code,
        population: record.fields.population || 0,
        timezone: record.fields.timezone || 'Unknown',
        coordinates: record.geometry?.coordinates as [number, number] || [0, 0],
        // Weather data will be populated later if includeWeather is true
        currentTemp: undefined,
        currentCondition: undefined,
        highTemp: undefined,
        lowTemp: undefined
      };
    });
    
    // If weather data is requested, fetch it for each city
    if (includeWeather) {
      console.log('Fetching weather data for cities...');
      
      // Process cities in batches to avoid too many simultaneous requests
      const batchSize = 5;
      const batches = Math.ceil(cities.length / batchSize);
      
      for (let i = 0; i < batches; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, cities.length);
        const batchCities = cities.slice(startIndex, endIndex);
        
        // Use Promise.allSettled to fetch weather data for all cities in parallel
        // without failing if some requests fail
        const weatherPromises = batchCities.map(city => 
          fetchCurrentWeatherSummary(city.name, city.countryCode)
            .catch(() => null) // Catch errors for individual cities
        );
        
        const weatherResults = await Promise.allSettled(weatherPromises);
        
        // Combine weather data with city data
        weatherResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            const cityIndex = startIndex + index;
            const weatherData = result.value;
            
            // Use a type assertion to update the city with weather data
            const cityWithWeather = cities[cityIndex] as CityTableData;
            cityWithWeather.currentTemp = weatherData.temp;
            cityWithWeather.currentCondition = weatherData.condition;
            cityWithWeather.highTemp = weatherData.highTemp;
            cityWithWeather.lowTemp = weatherData.lowTemp;
          }
        });
      }
    }
    
    return cities;
  } catch (error) {
    console.error('Error in fetchCities:', error);
    throw error;
  }
}

/**
 * Fetches current weather data for a city from OpenWeatherMap API
 * @param city - City name
 * @param country - Country code (optional)
 */
export async function fetchCurrentWeather(city: string, country?: string): Promise<WeatherApiResponse> {
  try {
    // Clean up the city name - remove any single quotes and normalize whitespace
    const cleanCityName = city.replace(/['"]/g, '').trim();
    
    // Build the location query - add country code if available
    const locationQuery = country ? `${cleanCityName},${country}` : cleanCityName;
    
    // Build API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationQuery)}&units=metric&appid=${WEATHER_API_KEY}`;
    // Log URL without exposing API key
    console.log('Fetching current weather from:', apiUrl.split(WEATHER_API_KEY).join('API_KEY_HIDDEN'));
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API response not OK:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received weather data for:', data.name);
    return data;
  } catch (error) {
    console.error('Error in fetchCurrentWeather:', error);
    throw error;
  }
}

/**
 * Fetches 5-day weather forecast for a city from OpenWeatherMap API
 * @param city - City name
 * @param country - Country code (optional)
 */
export async function fetchWeatherForecast(city: string, country?: string): Promise<ForecastApiResponse> {
  try {
    // Clean up the city name - remove any single quotes and normalize whitespace
    const cleanCityName = city.replace(/['"]/g, '').trim();
    
    // Build the location query - add country code if available
    const locationQuery = country ? `${cleanCityName},${country}` : cleanCityName;
    
    // Build API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(locationQuery)}&units=metric&appid=${WEATHER_API_KEY}`;
    console.log('Fetching forecast from:', apiUrl.replace(WEATHER_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Forecast API response not OK:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch forecast data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received forecast data for:', data.city.name, 'with', data.list.length, 'time points');
    return data;
  } catch (error) {
    console.error('Error in fetchWeatherForecast:', error);
    throw error;
  }
}

/**
 * Fetches both current weather and forecast for a city, combining them into a unified data structure
 * @param city - City name
 * @param country - Country code (optional)
 */
export async function fetchWeatherData(city: string, country?: string): Promise<WeatherData> {
  try {
    // Clean up the city name - remove any single quotes and normalize whitespace
    const cleanCityName = city.replace(/['"]/g, '').trim();
    
    // Use our server-side API endpoint instead of calling OpenWeatherMap directly
    const apiUrl = `/api/weather-detail?city=${encodeURIComponent(cleanCityName)}${country ? `&country=${country}` : ''}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();
    const currentData = data.current;
    const forecastData = data.forecast;

    // Process forecast data to get daily forecasts
    const dailyForecasts = processForecastData(forecastData);

    // Return combined weather data
    return {
      city: currentData.name,
      country: currentData.sys.country,
      coordinates: {
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        wind: {
          speed: currentData.wind.speed,
          deg: currentData.wind.deg
        },
        weather: {
          main: currentData.weather[0].main,
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon
        },
        visibility: currentData.visibility,
        clouds: currentData.clouds.all,
        dt: currentData.dt
      },
      forecast: dailyForecasts,
      timezone: currentData.timezone,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Processes 5-day forecast data into daily forecasts
 * @param forecastData - Raw forecast data from API
 */
function processForecastData(forecastData: ForecastApiResponse): DailyForecast[] {
  // Group forecast items by day
  const forecastsByDay = forecastData.list.reduce<Record<string, ForecastItem[]>>((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Process each day's forecasts
  return Object.entries(forecastsByDay).map(([date, items]) => {
    // Get min and max temperatures for the day
    const temps = items.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    // Get the noon forecast (or closest to it) for representative weather
    const noonForecast = items.reduce((closest, item) => {
      const itemHour = new Date(item.dt_txt).getHours();
      const closestHour = new Date(closest.dt_txt).getHours();
      return Math.abs(itemHour - 12) < Math.abs(closestHour - 12) ? item : closest;
    }, items[0]);

    // Calculate average probability of precipitation
    const avgPop = items.reduce((sum, item) => sum + item.pop, 0) / items.length;

    // Calculate average humidity
    const avgHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;

    const dateObj = new Date(date);
    
    return {
      date,
      day: format(dateObj, 'EEE'), // Short day name (Mon, Tue, etc.)
      temp: {
        min: minTemp,
        max: maxTemp
      },
      weather: {
        main: noonForecast.weather[0].main,
        description: noonForecast.weather[0].description,
        icon: noonForecast.weather[0].icon
      },
      pop: avgPop,
      humidity: Math.round(avgHumidity)
    };
  });
}

/**
 * Fetches just the current weather summary (temp and condition) for a city
 * This is a lightweight version for the cities table
 * @param city - City name
 * @param country - Country code (optional)
 */
export async function fetchCurrentWeatherSummary(city: string, country?: string): Promise<{
  temp: number;
  condition: string;
  highTemp: number;
  lowTemp: number;
}> {
  try {
    // Clean up the city name - remove any single quotes and normalize whitespace
    const cleanCityName = city.replace(/['"]/g, '').trim();
    
    // Use our server-side API endpoint instead of calling OpenWeatherMap directly
    const apiUrl = `/api/weather-summary?city=${encodeURIComponent(cleanCityName)}${country ? `&country=${country}` : ''}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather summary: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching weather summary:', error);
    throw error;
  }
}

// No additional imports needed, all types are imported at the top
