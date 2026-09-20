export interface GeoLocation {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface ForecastData {
  location: GeoLocation;
  timezone: string;
  timezoneAbbr?: string;
  current: CurrentWeather;
  daily: DailyForecastDay[];
  fetchedAt: string;
}

export interface PlanningRecommendation {
  id: string;
  dayLabel: string;
  category: 'rain' | 'heat' | 'cold' | 'wind' | 'clear' | 'ideal' | 'caution';
  severity: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  tip: string;
  metric?: string;
}
