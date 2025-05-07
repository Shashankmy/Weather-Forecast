import { Card, CardContent } from '@/components/ui/card';
import { DailyForecast } from '@/types';
import { formatTemperature, formatProbability } from '@/lib/utils';
import { WeatherIcon } from '@/assets/weather-icons';
import { Droplets } from 'lucide-react';

interface WeatherForecastProps {
  forecast: DailyForecast[];
  temperatureUnit?: 'celsius' | 'fahrenheit';
}

const WeatherForecast = ({ 
  forecast, 
  temperatureUnit = 'celsius' 
}: WeatherForecastProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {forecast.map((day) => (
        <Card key={day.date} className="overflow-hidden border border-blue-300 dark:border-blue-700 shadow-md">
          <div className="bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{day.day}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{day.date}</p>
            </div>
            
            <div className="flex justify-center my-3">
              <WeatherIcon condition={day.weather.main} className="h-12 w-12" />
            </div>
            
            <div className="text-center mb-2">
              <p className="text-sm capitalize text-gray-800 dark:text-gray-200">{day.weather.description}</p>
            </div>
            
            <div className="flex justify-between text-center">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formatTemperature(day.temp.min, temperatureUnit)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formatTemperature(day.temp.max, temperatureUnit)}</p>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <Droplets className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-800 dark:text-gray-200">{day.humidity}%</span>
              </div>
              <div>
                <span className="text-gray-800 dark:text-gray-200">Precip: {formatProbability(day.pop)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WeatherForecast;
