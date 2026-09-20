# Weather Intelligence App

A responsive, single-page React + Vite web application that helps users plan their day and week using live weather data directly from Open-Meteo.

## Features

1. **City Search & Geocoding**:
   - Prominent city search with instant execution on click or pressing `Enter`.
   - Multi-result resolution dropdown distinguishing locations (e.g., London, England vs. London, Ontario).
   - Instant search validation: search button is disabled on empty or whitespace input.
   - Graceful error messaging: shows `"City not found. Check the spelling and try again."` while keeping the search box responsive and usable.

2. **Current Weather Panel**:
   - Real-time Celsius temperature display.
   - WMO weather condition code interpretation with descriptive plain-English labels and weather icons.
   - Key metrics: Feels-like temperature (°C), Relative Humidity (%), Wind Speed (km/h), and Precipitation (mm).
   - Resolved location name and official time zone identifier with timezone abbreviation.

3. **7-Day Forecast**:
   - 7 responsive day cards showing weekday, date, WMO icon and condition, daytime high / overnight low temperatures, and precipitation probability.
   - Fully responsive grid layout that cleanly wraps on mobile screens down to 360px without horizontal scroll.

4. **Interactive Forecast Trends Chart**:
   - Dual-series responsive SVG chart mapping:
     - 7-day High & Low temperature curves (°C on left Y-axis).
     - Daily precipitation probability bars (% on right Y-axis).
   - Axis labels, legend, grid ticks, and tap/hover tooltip inspecting day-by-day metrics.
   - Designed to fit and remain readable on narrow phone widths.

5. **Planning Recommendations**:
   - Generates 3 to 5 clear, plain-language actionable tips based on forecast conditions.
   - Each recommendation explicitly names the day it refers to (e.g., rain umbrellas, extreme heat morning work scheduling, freezing commute times, wind securing, or clear sky outdoor windows).

6. **Error Handling & Resilience**:
   - Direct browser calls to free public Open-Meteo Geocoding and Forecast endpoints. No API keys or backend proxies needed.
   - Network failure and non-OK HTTP status handling with clear alert banners and a **Retry** button.
   - Loading skeletons and spinners for instant feedback during data retrieval.
   - Defaults to Toronto on first load so the app is immediately populated.

## Data Sources

- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`
- **Forecast API**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`

## How to Run

### Development
```bash
npm install
npm run dev
```
The application will start at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```
