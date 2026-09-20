import { GeoLocation, ForecastData, DailyForecastDay } from '../types';
import { formatDayLabel } from '../utils/weatherUtils';

export const DEFAULT_LOCATION: GeoLocation = {
  id: 6167865,
  name: 'Toronto',
  latitude: 43.70011,
  longitude: -79.4163,
  admin1: 'Ontario',
  country: 'Canada',
  country_code: 'CA',
  timezone: 'America/Toronto',
  population: 2600000,
};

export class WeatherServiceError extends Error {
  constructor(message: string, public readonly isNetworkOrServerError: boolean = false) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

/**
 * Searches cities using Open-Meteo geocoding API.
 * Calls directly from the browser without any API keys.
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new WeatherServiceError('Unable to reach the weather service. Please try again.', true);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
      population: item.population,
    }));
  } catch (error: any) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    // Network or parse failure
    throw new WeatherServiceError('Unable to reach the weather service. Please try again.', true);
  }
}

/**
 * Fetches 7-day forecast and current weather from Open-Meteo.
 */
export async function fetchForecast(location: GeoLocation): Promise<ForecastData> {
  const { latitude, longitude } = location;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new WeatherServiceError('Unable to reach the weather service. Please try again.', true);
    }

    const data = await res.json();
    if (!data || !data.current || !data.daily) {
      throw new WeatherServiceError('Unable to reach the weather service. Please try again.', true);
    }

    const dailyDays: DailyForecastDay[] = [];
    const times: string[] = data.daily.time || [];
    const weatherCodes: number[] = data.daily.weather_code || [];
    const tempMaxs: number[] = data.daily.temperature_2m_max || [];
    const tempMins: number[] = data.daily.temperature_2m_min || [];
    const precipSums: number[] = data.daily.precipitation_sum || [];
    const precipProbs: number[] = data.daily.precipitation_probability_max || [];
    const windSpeeds: number[] = data.daily.wind_speed_10m_max || [];

    for (let i = 0; i < times.length; i++) {
      const dateStr = times[i];
      const { dayName, formattedDate } = formatDayLabel(dateStr, i);
      dailyDays.push({
        date: dateStr,
        dayName,
        formattedDate,
        weatherCode: weatherCodes[i] ?? 0,
        tempMax: tempMaxs[i] ?? 0,
        tempMin: tempMins[i] ?? 0,
        precipitationSum: precipSums[i] ?? 0,
        precipitationProbabilityMax: precipProbs[i] ?? 0,
        windSpeedMax: windSpeeds[i] ?? 0,
      });
    }

    return {
      location,
      timezone: data.timezone || location.timezone || 'UTC',
      timezoneAbbr: data.timezone_abbreviation,
      current: {
        time: data.current.time,
        temperature: Math.round((data.current.temperature_2m ?? 0) * 10) / 10,
        relativeHumidity: Math.round(data.current.relative_humidity_2m ?? 0),
        apparentTemperature: Math.round((data.current.apparent_temperature ?? 0) * 10) / 10,
        precipitation: Math.round((data.current.precipitation ?? 0) * 10) / 10,
        weatherCode: data.current.weather_code ?? 0,
        windSpeed: Math.round((data.current.wind_speed_10m ?? 0) * 10) / 10,
      },
      daily: dailyDays,
      fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error: any) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    throw new WeatherServiceError('Unable to reach the weather service. Please try again.', true);
  }
}
