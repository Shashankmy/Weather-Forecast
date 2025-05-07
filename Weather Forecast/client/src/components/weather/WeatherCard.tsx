import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTemperature, formatWindSpeed, getWindDirection, formatTime } from '@/lib/utils';
import { WeatherData } from '@/types';
import { WeatherIcon } from '@/assets/weather-icons';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Eye, 
  Cloud,
  Sunrise,
  Sunset
} from 'lucide-react';

interface WeatherCardProps {
  weatherData: WeatherData;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windUnit?: 'metric' | 'imperial';
}

const WeatherCard = ({ 
  weatherData, 
  temperatureUnit = 'celsius',
  windUnit = 'metric'
}: WeatherCardProps) => {
  const { current, timezone } = weatherData;
  
  // Get background class based on weather condition
  const getBackgroundClass = () => {
    const condition = current.weather.main.toLowerCase();
    
    if (condition.includes('clear')) return 'bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-800 dark:to-blue-700';
    if (condition.includes('cloud')) return 'bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-gradient-to-r from-gray-500 to-gray-400 dark:from-gray-600 dark:to-gray-500';
    if (condition.includes('snow')) return 'bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-800 dark:to-blue-700';
    if (condition.includes('thunderstorm')) return 'bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-800 dark:to-gray-700';
    if (condition.includes('fog') || condition.includes('mist')) return 'bg-gradient-to-r from-gray-400 to-gray-300 dark:from-gray-600 dark:to-gray-500';
    
    return 'bg-gradient-to-r from-blue-300 to-blue-200 dark:from-blue-800 dark:to-blue-700';
  };

  return (
    <Card className={`overflow-hidden ${getBackgroundClass()} text-white shadow-lg border-2 border-blue-400 dark:border-blue-800`}>
      <CardHeader className="bg-black/20 p-6">
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">Current Weather</span>
          <WeatherIcon condition={current.weather.main} className="h-10 w-10" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <span className="text-5xl font-bold">
                {formatTemperature(current.temp, temperatureUnit)}
              </span>
              <span className="ml-2 text-lg">
                Feels like {formatTemperature(current.feels_like, temperatureUnit)}
              </span>
            </div>
            
            <p className="text-xl capitalize mb-2 font-medium">{current.weather.description}</p>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-white">
              <div className="flex items-center">
                <Sunrise className="mr-2 h-5 w-5 text-yellow-300" />
                <span>Sunrise: {formatTime(weatherData.sunrise, timezone)}</span>
              </div>
              <div className="flex items-center">
                <Sunset className="mr-2 h-5 w-5 text-orange-300" />
                <span>Sunset: {formatTime(weatherData.sunset, timezone)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3 text-white">
            <div className="flex items-center">
              <Droplets className="mr-2 h-5 w-5 text-blue-300" />
              <span>Humidity: {current.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="mr-2 h-5 w-5 text-blue-300" />
              <span>
                Wind: {formatWindSpeed(current.wind.speed, windUnit)} {getWindDirection(current.wind.deg)}
              </span>
            </div>
            <div className="flex items-center">
              <Gauge className="mr-2 h-5 w-5 text-blue-300" />
              <span>Pressure: {current.pressure} hPa</span>
            </div>
            <div className="flex items-center">
              <Cloud className="mr-2 h-5 w-5 text-blue-300" />
              <span>Cloudiness: {current.clouds}%</span>
            </div>
            <div className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-blue-300" />
              <span>Visibility: {(current.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className="flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-blue-300" />
              <span>
                High/Low: {weatherData.forecast[0]?.temp.max ? formatTemperature(weatherData.forecast[0].temp.max, temperatureUnit) : 'N/A'} / {weatherData.forecast[0]?.temp.min ? formatTemperature(weatherData.forecast[0].temp.min, temperatureUnit) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
