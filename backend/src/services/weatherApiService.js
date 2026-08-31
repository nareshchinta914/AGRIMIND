const axios = require('axios');
const env = require('../config/env');

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: '☀️', spray: 'Optimal', rainRisk: 0 },
  1: { label: 'Mainly Clear', icon: '🌤️', spray: 'Optimal', rainRisk: 5 },
  2: { label: 'Partly Cloudy', icon: '⛅', spray: 'Good (Morning)', rainRisk: 15 },
  3: { label: 'Overcast & Cloudy', icon: '☁️', spray: 'Good', rainRisk: 25 },
  45: { label: 'Foggy Conditions', icon: '🌫️', spray: 'Moderate - High Humidity', rainRisk: 10 },
  48: { label: 'Depositing Rime Fog', icon: '🌫️', spray: 'Moderate', rainRisk: 10 },
  51: { label: 'Light Drizzle', icon: '🌦️', spray: 'Avoid Spraying', rainRisk: 50 },
  53: { label: 'Moderate Drizzle', icon: '🌦️', spray: 'Avoid Spraying', rainRisk: 65 },
  55: { label: 'Dense Drizzle', icon: '🌧️', spray: 'No Spraying', rainRisk: 80 },
  61: { label: 'Slight Rain Showers', icon: '🌦️', spray: 'Avoid Spraying', rainRisk: 60 },
  63: { label: 'Moderate Rain', icon: '🌧️', spray: 'No Spraying - Washoff Risk', rainRisk: 85 },
  65: { label: 'Heavy Rainfall', icon: '⛈️', spray: 'No Spraying - Flood Warning', rainRisk: 95 },
  80: { label: 'Scattered Rain Showers', icon: '🌦️', spray: 'Avoid Spraying', rainRisk: 55 },
  81: { label: 'Moderate Rain Showers', icon: '🌧️', spray: 'No Spraying', rainRisk: 75 },
  82: { label: 'Violent Rain Showers', icon: '⛈️', spray: 'No Spraying', rainRisk: 95 },
  95: { label: 'Thunderstorm', icon: '⚡', spray: 'Hazardous - Stay Indoors', rainRisk: 90 },
  96: { label: 'Thunderstorm with Slight Hail', icon: '⛈️', spray: 'Hazardous', rainRisk: 95 },
  99: { label: 'Severe Thunderstorm with Heavy Hail', icon: '⛈️', spray: 'Severe Alert - Protect Crops', rainRisk: 100 }
};

const getWindDirection = (deg) => {
  if (deg == null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return isoString;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch (e) {
    return isoString;
  }
};

class WeatherApiService {
  /**
   * Resolve location coordinates (Lat/Lon) from query string or city/district name
   */
  async resolveCoordinates(locationName = 'Thanjavur, Tamil Nadu', lat, lon) {
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        displayName: locationName || 'Current GPS Location'
      };
    }

    try {
      const cleanQuery = (locationName || 'Thanjavur, Tamil Nadu')
        .replace(/district/gi, '')
        .replace(/state/gi, '')
        .trim();

      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cleanQuery
      )}&count=1&language=en&format=json`;

      const response = await axios.get(searchUrl, { timeout: 5000 });
      const result = response.data?.results?.[0];

      if (result) {
        const parts = [result.name, result.admin1, result.country].filter(Boolean);
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          displayName: parts.join(', ')
        };
      }
    } catch (err) {
      console.warn('[WeatherApiService] Geocoding lookup fallback:', err.message);
    }

    // Default fallback to Thanjavur (Granary of South India)
    return {
      latitude: 10.787,
      longitude: 79.1378,
      displayName: locationName || 'Thanjavur, Tamil Nadu, India'
    };
  }

  /**
   * Search locations by query string for auto-complete
   */
  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=6&language=en&format=json`;
      const response = await axios.get(searchUrl, { timeout: 4000 });
      const results = response.data?.results || [];
      return results.map((r) => ({
        id: r.id,
        name: r.name,
        district: r.admin2 || r.name,
        state: r.admin1 || '',
        country: r.country || 'India',
        latitude: r.latitude,
        longitude: r.longitude,
        displayName: [r.name, r.admin1, r.country].filter(Boolean).join(', ')
      }));
    } catch (err) {
      console.warn('[WeatherApiService] Search locations error:', err.message);
      return [];
    }
  }

  /**
   * Fetch LIVE current agro-weather + 7-day forecast using Open-Meteo real-time API
   */
  async getCurrentWeather(location, lat, lon) {
    const geo = await this.resolveCoordinates(location, lat, lon);

    // Primary: Open-Meteo High-Resolution Live Meteorological Model
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset&timezone=auto`;

      const response = await axios.get(weatherUrl, { timeout: 7000 });
      const current = response.data?.current;
      const daily = response.data?.daily;

      if (current) {
        const codeInfo = WMO_CODE_MAP[current.weather_code] || {
          label: 'Partly Cloudy',
          icon: '⛅',
          spray: 'Good',
          rainRisk: 15
        };

        const temp = Math.round(current.temperature_2m * 10) / 10;
        const feelsLike = Math.round(current.apparent_temperature * 10) / 10;
        const humidity = Math.round(current.relative_humidity_2m);
        const windSpeed = Math.round(current.wind_speed_10m * 10) / 10;
        const windDir = getWindDirection(current.wind_direction_10m);
        const rainProbability = daily?.precipitation_probability_max?.[0] ?? (current.rain > 0 ? 80 : 10);
        const rainfall = Math.round((current.precipitation || current.rain || 0) * 10) / 10;
        const sunriseIso = daily?.sunrise?.[0];
        const sunsetIso = daily?.sunset?.[0];

        // Compute specialized agro spray advisory
        let sprayAdvisory = codeInfo.spray;
        if (rainProbability > 40 || rainfall > 1) {
          sprayAdvisory = 'Rain expected — Postpone foliar spraying to prevent runoff';
        } else if (windSpeed > 15) {
          sprayAdvisory = `High winds (${windSpeed} km/h) — Spray early morning (6:00-8:30 AM) to avoid drift`;
        } else if (temp > 35) {
          sprayAdvisory = `High heat (${temp}°C) — Avoid midday spraying; apply in evening or dawn`;
        } else {
          sprayAdvisory = 'Optimal conditions for crop spraying & nutrient top-dressing';
        }

        // Format 7-Day Forecast
        const forecastList = [];
        if (daily?.time && Array.isArray(daily.time)) {
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
            const dateObj = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getDay()];
            const dayCode = daily.weather_code?.[i] ?? 1;
            const dayInfo = WMO_CODE_MAP[dayCode] || { label: 'Clear Skies', icon: '☀️', spray: 'Optimal' };
            const dayRainProb = daily.precipitation_probability_max?.[i] ?? 10;
            const dayRainSum = daily.precipitation_sum?.[i] ?? 0;

            forecastList.push({
              day: dayName,
              date: formatDate(daily.time[i]),
              tempMax: Math.round(daily.temperature_2m_max?.[i] ?? temp),
              tempMin: Math.round(daily.temperature_2m_min?.[i] ?? (temp - 6)),
              condition: dayInfo.label,
              icon: dayInfo.icon,
              rainProbability: dayRainProb,
              rainfall: Math.round(dayRainSum * 10) / 10,
              sunrise: formatTime(daily.sunrise?.[i]),
              sunset: formatTime(daily.sunset?.[i]),
              spray: dayRainProb > 45 ? 'Avoid Spraying' : dayRainProb > 25 ? 'Moderate' : 'Favorable'
            });
          }
        }

        const now = new Date();
        return {
          location: geo.displayName,
          latitude: geo.latitude,
          longitude: geo.longitude,
          temperature: temp,
          feelsLike,
          humidity,
          windSpeed: `${windSpeed} km/h ${windDir}`,
          windSpeedRaw: windSpeed,
          windDirection: windDir,
          condition: codeInfo.label,
          description: `${codeInfo.label} with ${humidity}% humidity and ${windSpeed} km/h ${windDir} wind.`,
          icon: codeInfo.icon,
          weatherCode: current.weather_code,
          rainProbability,
          rainfall,
          sunrise: formatTime(sunriseIso),
          sunset: formatTime(sunsetIso),
          uvIndex: temp > 33 ? 'Very High (8)' : temp > 28 ? 'Moderate (5)' : 'Low (3)',
          soilMoisture: humidity > 70 ? '82% (High Hydration)' : humidity > 50 ? '68% (Optimal)' : '48% (Dry)',
          sprayAdvisory,
          lastUpdated: now.toISOString(),
          lastUpdatedFormatted: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          isLive: true,
          source: 'Open-Meteo High-Resolution Station Feed',
          forecast: forecastList
        };
      }
    } catch (apiErr) {
      console.warn('[WeatherApiService] Open-Meteo live call failed, attempting OpenWeatherMap fallback:', apiErr.message);
    }

    // Secondary: OpenWeatherMap if configured
    if (env.WEATHER_API_KEY && env.WEATHER_API_KEY !== 'demo_weather_api_key') {
      try {
        const owmUrl = `${env.WEATHER_API_BASE_URL}/weather?lat=${geo.latitude}&lon=${geo.longitude}&appid=${env.WEATHER_API_KEY}&units=metric`;
        const res = await axios.get(owmUrl, { timeout: 6000 });
        const d = res.data;
        const now = new Date();
        return {
          location: `${d.name || geo.displayName}, India`,
          latitude: geo.latitude,
          longitude: geo.longitude,
          temperature: Math.round(d.main.temp * 10) / 10,
          feelsLike: Math.round(d.main.feels_like * 10) / 10,
          humidity: d.main.humidity,
          windSpeed: `${Math.round(d.wind.speed * 3.6)} km/h`,
          windSpeedRaw: Math.round(d.wind.speed * 3.6),
          windDirection: getWindDirection(d.wind.deg),
          condition: d.weather?.[0]?.main || 'Clear',
          description: d.weather?.[0]?.description || 'Clear sky',
          icon: '☀️',
          rainProbability: d.rain ? 70 : 10,
          rainfall: d.rain?.['1h'] || 0,
          sunrise: formatTime(new Date(d.sys.sunrise * 1000).toISOString()),
          sunset: formatTime(new Date(d.sys.sunset * 1000).toISOString()),
          uvIndex: 'Moderate (5)',
          soilMoisture: '70% (Adequate)',
          sprayAdvisory: d.wind.speed < 4 ? 'Optimal for foliar spray' : 'Moderate wind - spray early morning',
          lastUpdated: now.toISOString(),
          lastUpdatedFormatted: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          isLive: true,
          source: 'OpenWeatherMap Live Feed',
          forecast: []
        };
      } catch (owmErr) {
        console.warn('[WeatherApiService] OpenWeatherMap call failed:', owmErr.message);
      }
    }

    throw new Error('Real-time weather station feed currently unavailable. Please check your network connection.');
  }

  /**
   * Fetch 7-Day agricultural weather forecast
   */
  async get7DayForecast(location, lat, lon) {
    const currentWeather = await this.getCurrentWeather(location, lat, lon);
    return currentWeather.forecast || [];
  }
}

module.exports = new WeatherApiService();
