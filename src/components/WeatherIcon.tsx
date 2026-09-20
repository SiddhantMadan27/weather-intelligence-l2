import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LucideProps,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

interface WeatherIconProps extends Omit<LucideProps, 'ref'> {
  code: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = 'w-6 h-6', ...props }) => {
  const condition = getWeatherCondition(code);

  switch (condition.iconName) {
    case 'sun':
      return <Sun className={`text-amber-500 ${className}`} {...props} />;
    case 'cloud-sun':
      return <CloudSun className={`text-amber-400 ${className}`} {...props} />;
    case 'cloud':
      return <Cloud className={`text-slate-400 ${className}`} {...props} />;
    case 'cloud-fog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`text-sky-400 ${className}`} {...props} />;
    case 'cloud-rain':
      return <CloudRain className={`text-blue-500 ${className}`} {...props} />;
    case 'cloud-snow':
      return <CloudSnow className={`text-indigo-300 ${className}`} {...props} />;
    case 'cloud-lightning':
      return <CloudLightning className={`text-amber-600 ${className}`} {...props} />;
    default:
      return <CloudSun className={`text-amber-400 ${className}`} {...props} />;
  }
};
