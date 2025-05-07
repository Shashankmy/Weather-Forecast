import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { WeatherData } from '@/types';
import { fetchWeatherData } from '@/lib/api';
import WeatherCard from './WeatherCard';
import WeatherForecast from './WeatherForecast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArrowLeft, RefreshCcw, Thermometer, ThermometerSun, Wind } from 'lucide-react';

interface WeatherDisplayProps {
  city: string;
  country?: string;
}

const WeatherDisplay = ({ city, country }: WeatherDisplayProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [windUnit, setWindUnit] = useState<'metric' | 'imperial'>('metric');
  const [, navigate] = useLocation();

  // Load weather data
  useEffect(() => {
    loadWeatherData();
  }, [city, country]);

  const loadWeatherData = async () => {
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
  };

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };
  
  // Toggle wind unit
  const toggleWindUnit = () => {
    setWindUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Handle going back to cities list
  const handleBack = () => {
    navigate('/');
  };

  // Handle manual refresh
  const handleRefresh = () => {
    loadWeatherData();
  };
  
  // Get background class based on weather condition
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900';
    
    const condition = weatherData.current.weather.main.toLowerCase();
    
    if (condition.includes('clear')) return 'bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800';
    if (condition.includes('cloud')) return 'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-700';
    if (condition.includes('snow')) return 'bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-blue-900';
    if (condition.includes('thunderstorm')) return 'bg-gradient-to-b from-gray-500 to-gray-600 dark:from-gray-900 dark:to-gray-800';
    if (condition.includes('fog') || condition.includes('mist')) return 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700';
    
    return 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900';
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} transition-colors duration-500`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-6">
          {/* Header with city name and controls */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cities
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTemperatureUnit}
                className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                {temperatureUnit === 'celsius' ? (
                  <>
                    <Thermometer className="mr-2 h-4 w-4" />
                    °C
                  </>
                ) : (
                  <>
                    <ThermometerSun className="mr-2 h-4 w-4" />
                    °F
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWindUnit}
                className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                <Wind className="mr-2 h-4 w-4" />
                {windUnit === 'metric' ? 'm/s' : 'mph'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                disabled={loading}
              >
                <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* City name heading */}
          {weatherData && (
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Weather in {weatherData.city}, {weatherData.country}
            </h1>
          )}
          
          {/* Loading/error states */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Card className="mx-auto max-w-2xl bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading Weather</h2>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <Button 
                  onClick={handleRefresh}
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-800 dark:hover:bg-red-700 dark:text-white"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : weatherData ? (
            <div className="space-y-6">
              {/* Current weather card */}
              <WeatherCard 
                weatherData={weatherData} 
                temperatureUnit={temperatureUnit}
                windUnit={windUnit}
              />
              
              {/* Forecast tabs */}
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="daily">5-Day Forecast</TabsTrigger>
                  <TabsTrigger value="hourly">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-4">
                  <WeatherForecast 
                    forecast={weatherData.forecast}
                    temperatureUnit={temperatureUnit}
                  />
                </TabsContent>
                <TabsContent value="hourly" className="mt-4">
                  <Card className="border border-blue-300 dark:border-blue-700 shadow-md">
                    <CardContent className="p-6 bg-blue-50 dark:bg-gray-800">
                      <div className="text-center">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Weather data provided by OpenWeatherMap
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                          Location: {weatherData.coordinates.lat.toFixed(2)}°, {weatherData.coordinates.lon.toFixed(2)}°
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                          Last updated: {new Date(weatherData.current.dt * 1000).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
