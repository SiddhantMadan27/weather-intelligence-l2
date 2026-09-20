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

---

## Deployment

This application was generated in Google AI Studio App Build, connected directly to GitHub from AI Studio, and deployed to Cloudflare Pages from that repository.

**Live URL:** https://weather-intelligence-l2-b7d.pages.dev

### 1. Build in Google AI Studio App Build

1. Open Google AI Studio App Build and create a new app.
2. Describe the Weather Intelligence App: city search through the Open-Meteo Geocoding API, current conditions and a 7-day forecast through the Open-Meteo Forecast API, a trends chart, rule-based planning recommendations, and explicit error states.
3. Generate the app and test city search, forecast cards, the chart, recommendations and the city-not-found state in the AI Studio preview.

No API keys, secrets, or Google Cloud services are used. Open-Meteo is a free public API that requires no authentication, and every request is made directly from the browser.

### 2. Connect the app to GitHub from AI Studio

1. In the Code view, open Export then Push to GitHub.
2. Sign in to GitHub and authorize the Google AI Studio GitHub connection.
3. Select or create the target repository, then push.
4. The GitHub sync panel confirms that GitHub and Google AI Studio are in sync.
5. Verify the repository contains package.json, src/, README.md and vite.config.ts.

### 3. Deploy to Cloudflare Pages

1. In Cloudflare, go to Workers & Pages, then Create application, then Pages, then Import an existing Git repository.
2. Connect GitHub and grant the Cloudflare Workers and Pages app access to this repository only.
3. Select the repository and click Begin setup.
4. Configure the build settings:

| Setting | Value |
| --- | --- |
| Production branch | main |
| Framework preset | None |
| Build command | npm run build |
| Build output directory | dist |

5. Click Save and Deploy, then open the generated pages.dev URL.

Automatic deployments are enabled. Every push to main triggers a new Cloudflare Pages build.

### Local development

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # outputs to dist/
    npm run preview

### Troubleshooting

**Cloudflare build fails with npm error code ERESOLVE**

The generated package.json pinned esbuild ^0.25.0 as a devDependency while also requiring vite ^8.3.0, which needs peerOptional esbuild ^0.27.0 or ^0.28.0. npm could not resolve the peer dependency and npm install exited with code 1. Fix: remove the esbuild entry from devDependencies, because Vite bundles its own esbuild and no source file imports esbuild directly. Commit and push, and Cloudflare rebuilds automatically.

**Page returns 404 after a browser refresh**

Add a _redirects file at the project root containing the line /* /index.html 200 and redeploy. This app is a single page with no client-side routes, and refresh was verified working without it.

**Weather data does not load**

Open the browser console and confirm both Open-Meteo endpoints are reachable, then try another city.
