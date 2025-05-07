import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  CloudLightning, 
  Wind 
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export const WeatherIcon = ({ condition, className = "h-4 w-4" }: WeatherIconProps) => {
  switch (condition) {
    case 'Clear':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'Clouds':
      return <Cloud className={`${className} text-gray-500`} />;
    case 'Rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'Drizzle':
      return <CloudRain className={`${className} text-blue-300`} />;
    case 'Snow':
      return <CloudSnow className={`${className} text-blue-200`} />;
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return <CloudFog className={`${className} text-gray-400`} />;
    case 'Thunderstorm':
      return <CloudLightning className={`${className} text-purple-500`} />;
    default:
      return <Wind className={`${className} text-cyan-500`} />;
  }
};

export default WeatherIcon;