import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = 'h-6 w-6' }) => {
  const lowerCondition = condition.toLowerCase();
  
  // Map condition to icon
  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
    return <Sun className={`text-yellow-500 ${className}`} />;
  }
  
  if (lowerCondition.includes('cloud') && !lowerCondition.includes('rain') && !lowerCondition.includes('snow')) {
    return <Cloud className={`text-gray-400 ${className}`} />;
  }
  
  if (lowerCondition.includes('drizzle')) {
    return <CloudDrizzle className={`text-blue-400 ${className}`} />;
  }
  
  if (lowerCondition.includes('rain')) {
    return <CloudRain className={`text-blue-500 ${className}`} />;
  }
  
  if (lowerCondition.includes('snow')) {
    return <CloudSnow className={`text-blue-200 ${className}`} />;
  }
  
  if (lowerCondition.includes('thunder') || lowerCondition.includes('lightning')) {
    return <CloudLightning className={`text-yellow-600 ${className}`} />;
  }
  
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist') || lowerCondition.includes('haze')) {
    return <CloudFog className={`text-gray-300 ${className}`} />;
  }
  
  // Default to cloud if condition is not recognized
  return <Cloud className={`text-gray-400 ${className}`} />;
};

// Weather icon map for different conditions
export const getWeatherIcon = (condition: string, className?: string) => {
  return <WeatherIcon condition={condition} className={className} />;
};
