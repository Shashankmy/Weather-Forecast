// Types for OpenDataSoft API city data
export interface CityApiResponse {
  nhits: number;
  parameters: {
    dataset: string;
    rows: number;
    start: number;
    format: string;
    timezone: string;
  };
  records: CityRecord[];
}

export interface CityRecord {
  datasetid: string;
  recordid: string;
  fields: CityFields;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface CityFields {
  name: string;
  ascii_name?: string;
  alternate_names?: string;
  feature_class?: string;
  feature_code?: string;
  country_code: string;
  cou_name_en: string;
  population: number;
  dem?: number;
  timezone: string;
  modification_date?: string;
}

export interface CityTableData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  timezone: string;
  coordinates: [number, number];
  currentTemp?: number | undefined;
  currentCondition?: string | undefined;
  highTemp?: number | undefined;
  lowTemp?: number | undefined;
}

// Types for OpenWeatherMap API weather data
export interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: {
    "3h": number;
  };
  snow?: {
    "3h": number;
  };
  sys: {
    pod: string; // Part of day (d = day, n = night)
  };
  dt_txt: string;
}

// Simplified weather data type for UI
export interface WeatherData {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind: {
      speed: number;
      deg: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    visibility: number;
    clouds: number;
    dt: number; // Timestamp
  };
  forecast: DailyForecast[];
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface DailyForecast {
  date: string;
  day: string;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  pop: number; // Probability of precipitation
  humidity: number;
}
