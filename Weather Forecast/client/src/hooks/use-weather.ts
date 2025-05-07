import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '@/types';
import { fetchWeatherData } from '@/lib/api';

interface UseWeatherParams {
  city: string;
  country?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseWeatherResult {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
  temperatureUnit: 'celsius' | 'fahrenheit';
  setWindUnit: (unit: 'metric' | 'imperial') => void;
  windUnit: 'metric' | 'imperial';
}

export function useWeather({
  city,
  country,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
}: UseWeatherParams): UseWeatherResult {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [windUnit, setWindUnit] = useState<'metric' | 'imperial'>('metric');

  // Function to load weather data
  const loadWeatherData = useCallback(async () => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(city, country);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Error loading weather data:', err);
    } finally {
      setLoading(false);
    }
  }, [city, country]);

  // Initial load
  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      loadWeatherData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, loadWeatherData]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await loadWeatherData();
  }, [loadWeatherData]);

  return {
    weatherData,
    loading,
    error,
    refresh,
    temperatureUnit,
    setTemperatureUnit,
    windUnit,
    setWindUnit,
  };
}
