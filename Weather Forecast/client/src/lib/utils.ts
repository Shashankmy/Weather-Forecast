import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a population number with appropriate suffixes (K, M, B)
 * @param population - The population value to format
 */
export function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return (population / 1000000000).toFixed(1) + 'B';
  } else if (population >= 1000000) {
    return (population / 1000000).toFixed(1) + 'M';
  } else if (population >= 1000) {
    return (population / 1000).toFixed(1) + 'K';
  } else {
    return population.toString();
  }
}

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Converts temperature from Celsius to Fahrenheit
 * @param celsius - Temperature in Celsius
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Formats temperature with the appropriate unit symbol
 * @param temp - Temperature value
 * @param unit - Unit of temperature ('celsius' or 'fahrenheit')
 */
export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  const tempValue = unit === 'celsius' ? temp : celsiusToFahrenheit(temp);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(tempValue)}${unitSymbol}`;
}

/**
 * Formats wind speed with the appropriate unit
 * @param speed - Wind speed in meters per second
 * @param unit - Unit for wind speed ('metric' or 'imperial')
 */
export function formatWindSpeed(speed: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    // Convert to mph
    return `${Math.round(speed * 2.237)} mph`;
  }
  return `${Math.round(speed)} m/s`;
}

/**
 * Converts wind direction in degrees to a cardinal direction
 * @param degrees - Wind direction in degrees
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Formats a timestamp as a readable time string
 * @param timestamp - Unix timestamp in seconds
 * @param timezone - Timezone offset in seconds
 */
export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Returns the appropriate CSS class for a weather condition
 * @param condition - Weather condition string
 */
export function getWeatherClass(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear')) return 'bg-sunny';
  if (lowerCondition.includes('cloud')) return 'bg-cloudy';
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'bg-rainy';
  if (lowerCondition.includes('snow')) return 'bg-snowy';
  if (lowerCondition.includes('thunderstorm')) return 'bg-stormy';
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return 'bg-foggy';
  
  return 'bg-default';
}

/**
 * Returns the weather icon URL from OpenWeatherMap
 * @param iconCode - Weather icon code
 * @param size - Icon size ('2x' or '4x')
 */
export function getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

/**
 * Formats a probability as a percentage
 * @param probability - Probability value (0-1)
 */
export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/**
 * Debounces a function
 * @param func - The function to debounce
 * @param wait - The debounce wait time in ms
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a random city ID
 * Used for development/testing purposes
 */
export function generateCityId(): string {
  return Math.random().toString(36).substring(2, 10);
}
