import { DailyForecastDay, PlanningRecommendation } from '../types';

export interface WeatherCondition {
  label: string;
  description: string;
  iconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning';
  type: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunder';
}

export function getWeatherCondition(code: number): WeatherCondition {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', description: 'Sunny and clear conditions', iconName: 'sun', type: 'clear' };
    case 1:
      return { label: 'Mainly Clear', description: 'Mostly clear skies with bright intervals', iconName: 'cloud-sun', type: 'clear' };
    case 2:
      return { label: 'Partly Cloudy', description: 'Scattered cloud cover with sunny breaks', iconName: 'cloud-sun', type: 'cloudy' };
    case 3:
      return { label: 'Overcast', description: 'Persistent gray cloud cover throughout', iconName: 'cloud', type: 'cloudy' };
    case 45:
      return { label: 'Foggy', description: 'Reduced visibility due to fog', iconName: 'cloud-fog', type: 'fog' };
    case 48:
      return { label: 'Rime Fog', description: 'Depositing rime fog with icy surfaces', iconName: 'cloud-fog', type: 'fog' };
    case 51:
      return { label: 'Light Drizzle', description: 'Intermittent gentle mist or light drizzle', iconName: 'cloud-drizzle', type: 'rain' };
    case 53:
      return { label: 'Moderate Drizzle', description: 'Steady fine drizzle', iconName: 'cloud-drizzle', type: 'rain' };
    case 55:
      return { label: 'Dense Drizzle', description: 'Heavy misty drizzle causing wet pavement', iconName: 'cloud-drizzle', type: 'rain' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', description: 'Freezing drizzle forming thin glaze on surfaces', iconName: 'cloud-drizzle', type: 'rain' };
    case 61:
      return { label: 'Slight Rain', description: 'Light rainfall with occasional dry spells', iconName: 'cloud-rain', type: 'rain' };
    case 63:
      return { label: 'Moderate Rain', description: 'Continuous steady rain showers', iconName: 'cloud-rain', type: 'rain' };
    case 65:
      return { label: 'Heavy Rain', description: 'Substantial downpours and wet ground', iconName: 'cloud-rain', type: 'rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', description: 'Hazardous freezing rain causing slick roads', iconName: 'cloud-rain', type: 'rain' };
    case 71:
      return { label: 'Slight Snow', description: 'Light dusting of gentle snow flurries', iconName: 'cloud-snow', type: 'snow' };
    case 73:
      return { label: 'Moderate Snow', description: 'Steady snowfall accumulating on sidewalks', iconName: 'cloud-snow', type: 'snow' };
    case 75:
      return { label: 'Heavy Snow', description: 'Significant snow accumulation with reduced visibility', iconName: 'cloud-snow', type: 'snow' };
    case 77:
      return { label: 'Snow Grains', description: 'Small crystalline frozen snow grains', iconName: 'cloud-snow', type: 'snow' };
    case 80:
      return { label: 'Passing Showers', description: 'Scattered brief rain showers', iconName: 'cloud-rain', type: 'rain' };
    case 81:
      return { label: 'Moderate Showers', description: 'Brisk rain showers with wet conditions', iconName: 'cloud-rain', type: 'rain' };
    case 82:
      return { label: 'Violent Showers', description: 'Torrential rain bursts and puddles', iconName: 'cloud-rain', type: 'rain' };
    case 85:
    case 86:
      return { label: 'Snow Showers', description: 'Periodic gusts of snow flurries', iconName: 'cloud-snow', type: 'snow' };
    case 95:
      return { label: 'Thunderstorm', description: 'Thunder, lightning, and rain bursts', iconName: 'cloud-lightning', type: 'thunder' };
    case 96:
    case 99:
      return { label: 'Severe Thunderstorm', description: 'Thunderstorm accompanied by gusty hail', iconName: 'cloud-lightning', type: 'thunder' };
    default:
      return { label: 'Variable', description: 'Changing regional conditions', iconName: 'cloud-sun', type: 'cloudy' };
  }
}

export function formatDayLabel(dateStr: string, index: number): { dayName: string; formattedDate: string } {
  // dateStr is YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekday = dayNames[dateObj.getDay()];
  const monthName = monthNames[dateObj.getMonth()];

  let dayName = weekday;
  if (index === 0) {
    dayName = 'Today';
  } else if (index === 1) {
    dayName = 'Tomorrow';
  }

  return {
    dayName,
    formattedDate: `${monthName} ${day}`
  };
}

/**
 * Generates 3 to 5 clear plain-language planning tips based on the 7-day forecast.
 * Each tip explicitly names the day it refers to.
 */
export function generatePlanningRecommendations(days: DailyForecastDay[]): PlanningRecommendation[] {
  if (!days || days.length === 0) return [];

  const tips: PlanningRecommendation[] = [];

  // Helper to get friendly day name (e.g. "Tuesday" or "Today (Sunday)")
  const getDayName = (day: DailyForecastDay, idx: number) => {
    if (idx === 0) return 'Today';
    if (idx === 1) return 'Tomorrow';
    return day.dayName;
  };

  // 1. High Precipitation Probability (> 60%)
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.precipitationProbabilityMax >= 60) {
      const dayRef = getDayName(day, i);
      tips.push({
        id: `rain-${day.date}`,
        dayLabel: dayRef,
        category: 'rain',
        severity: 'warning',
        title: 'Rain Protection',
        tip: `${dayRef}: High precipitation probability (${Math.round(day.precipitationProbabilityMax)}%) — carry an umbrella and wear water-resistant footwear.`,
        metric: `${Math.round(day.precipitationProbabilityMax)}% rain chance`
      });
      break; // Pick the most prominent rain day or first upcoming
    }
  }

  // 2. High Wind (> 40 km/h)
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.windSpeedMax >= 40) {
      const dayRef = getDayName(day, i);
      tips.push({
        id: `wind-${day.date}`,
        dayLabel: dayRef,
        category: 'wind',
        severity: 'warning',
        title: 'Wind Advisory',
        tip: `${dayRef}: Gusty winds reaching up to ${Math.round(day.windSpeedMax)} km/h — secure loose outdoor items and expect blustery travel.`,
        metric: `${Math.round(day.windSpeedMax)} km/h gusts`
      });
      break;
    }
  }

  // 3. Extreme Heat (> 30°C)
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.tempMax >= 30) {
      const dayRef = getDayName(day, i);
      tips.push({
        id: `heat-${day.date}`,
        dayLabel: dayRef,
        category: 'heat',
        severity: 'alert',
        title: 'Heat Safety',
        tip: `${dayRef}: High temperatures reaching ${Math.round(day.tempMax)}°C — plan strenuous outdoor work for the morning and stay hydrated.`,
        metric: `High of ${Math.round(day.tempMax)}°C`
      });
      break;
    }
  }

  // 4. Freezing Temperatures (< 0°C)
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.tempMin <= 0 || day.tempMax <= 0) {
      const dayRef = getDayName(day, i);
      const isSubzeroHigh = day.tempMax <= 0;
      tips.push({
        id: `cold-${day.date}`,
        dayLabel: dayRef,
        category: 'cold',
        severity: 'warning',
        title: 'Freezing Conditions',
        tip: `${dayRef}: Low drops to ${Math.round(day.tempMin)}°C${isSubzeroHigh ? ' with sub-zero highs' : ''} — allow extra commute time for potential ice and dress in insulated layers.`,
        metric: `Low of ${Math.round(day.tempMin)}°C`
      });
      break;
    }
  }

  // 5. Run of clear days (2 or more consecutive days with low rain and clear/mainly clear)
  let clearRunStart = -1;
  let clearRunLength = 0;
  for (let i = 0; i < days.length; i++) {
    const isClear = (days[i].weatherCode <= 2) && (days[i].precipitationProbabilityMax < 25);
    if (isClear) {
      if (clearRunStart === -1) clearRunStart = i;
      clearRunLength++;
    } else {
      if (clearRunLength >= 2) break;
      clearRunStart = -1;
      clearRunLength = 0;
    }
  }

  if (clearRunLength >= 2 && clearRunStart !== -1) {
    const startDay = getDayName(days[clearRunStart], clearRunStart);
    const endDay = getDayName(days[clearRunStart + clearRunLength - 1], clearRunStart + clearRunLength - 1);
    const dayLabel = clearRunLength === 2 ? `${startDay} & ${endDay}` : `${startDay} through ${endDay}`;
    tips.push({
      id: `clear-run-${days[clearRunStart].date}`,
      dayLabel,
      category: 'clear',
      severity: 'success',
      title: 'Outdoor Window',
      tip: `${dayLabel}: A consecutive run of clear skies is predicted — excellent window for outdoor sports, yard maintenance, or gatherings.`,
      metric: `${clearRunLength} days clear`
    });
  }

  // 6. If we still need tips to reach 3 to 5, check other specific day patterns:
  // Check for day with highest rain accumulation (> 5mm) if not already added
  if (tips.length < 3) {
    const heaviestRain = [...days].sort((a, b) => b.precipitationSum - a.precipitationSum)[0];
    if (heaviestRain && heaviestRain.precipitationSum > 5 && !tips.some(t => t.id.includes(heaviestRain.date))) {
      const idx = days.findIndex(d => d.date === heaviestRain.date);
      const dayRef = getDayName(heaviestRain, idx);
      tips.push({
        id: `rainsum-${heaviestRain.date}`,
        dayLabel: dayRef,
        category: 'rain',
        severity: 'info',
        title: 'Wet Conditions',
        tip: `${dayRef}: Expect noticeable rain accumulation around ${heaviestRain.precipitationSum.toFixed(1)} mm — plan indoor activities or bring raincoats.`,
        metric: `${heaviestRain.precipitationSum.toFixed(1)} mm rain`
      });
    }
  }

  // Check for the warmest/mildest pleasant day (18°C - 26°C with low rain)
  if (tips.length < 3) {
    const pleasantDay = days.find((d, idx) => d.tempMax >= 18 && d.tempMax <= 26 && d.precipitationProbabilityMax < 35 && !tips.some(t => t.dayLabel.includes(getDayName(d, idx))));
    if (pleasantDay) {
      const idx = days.findIndex(d => d.date === pleasantDay.date);
      const dayRef = getDayName(pleasantDay, idx);
      tips.push({
        id: `pleasant-${pleasantDay.date}`,
        dayLabel: dayRef,
        category: 'ideal',
        severity: 'success',
        title: 'Pleasant Weather',
        tip: `${dayRef}: Mild temperatures peaking at ${Math.round(pleasantDay.tempMax)}°C with minimal rain risk — ideal day for a walk, commute by bike, or patio dining.`,
        metric: `High of ${Math.round(pleasantDay.tempMax)}°C`
      });
    }
  }

  // Check for sudden temperature swing between consecutive days (change > 6°C)
  if (tips.length < 3) {
    for (let i = 0; i < days.length - 1; i++) {
      const tempDiff = days[i + 1].tempMax - days[i].tempMax;
      if (Math.abs(tempDiff) >= 6) {
        const nextDayRef = getDayName(days[i + 1], i + 1);
        const prevDayRef = getDayName(days[i], i);
        const direction = tempDiff > 0 ? 'warmer' : 'cooler';
        tips.push({
          id: `swing-${days[i + 1].date}`,
          dayLabel: nextDayRef,
          category: 'caution',
          severity: 'info',
          title: 'Temperature Shift',
          tip: `${nextDayRef}: Notable shift to ${Math.abs(Math.round(tempDiff))}°C ${direction} compared to ${prevDayRef} — adjust your layers accordingly.`,
          metric: `${Math.abs(Math.round(tempDiff))}°C change`
        });
        break;
      }
    }
  }

  // Check for cool day / light jacket reminder
  if (tips.length < 3) {
    const coolDay = days.find((d, idx) => d.tempMax < 15 && d.tempMin > 0 && !tips.some(t => t.id.includes(d.date)));
    if (coolDay) {
      const idx = days.findIndex(d => d.date === coolDay.date);
      const dayRef = getDayName(coolDay, idx);
      tips.push({
        id: `cool-${coolDay.date}`,
        dayLabel: dayRef,
        category: 'caution',
        severity: 'info',
        title: 'Layering Tip',
        tip: `${dayRef}: Daytime temperatures crest around ${Math.round(coolDay.tempMax)}°C — keep a light jacket or knit sweater handy.`,
        metric: `High of ${Math.round(coolDay.tempMax)}°C`
      });
    }
  }

  // If still fewer than 3, add general overview for the start of the week or upcoming day
  if (tips.length < 3 && days.length > 0) {
    const targetDay = days[0];
    tips.push({
      id: `outlook-${targetDay.date}`,
      dayLabel: 'Today',
      category: 'ideal',
      severity: 'info',
      title: 'Daily Outlook',
      tip: `Today: Expect high of ${Math.round(targetDay.tempMax)}°C and low of ${Math.round(targetDay.tempMin)}°C with ${Math.round(targetDay.precipitationProbabilityMax)}% chance of rain.`,
      metric: `${Math.round(targetDay.tempMin)}°C / ${Math.round(targetDay.tempMax)}°C`
    });
  }

  // Cap at 5 tips as requested: "a panel of 3 to 5 short plain-language tips generated from the forecast with simple rules, each naming the day it refers to."
  return tips.slice(0, 5);
}
