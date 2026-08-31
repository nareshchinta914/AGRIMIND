const weatherService = require('../services/weatherApiService');
const { successResponse, errorResponse } = require('../utils/response');

class WeatherController {
  async getCurrent(req, res, next) {
    try {
      const { location, lat, lon, state, district, city } = req.query;
      const resolvedLocation =
        location ||
        (district && state ? `${district}, ${state}` : null) ||
        city ||
        'Thanjavur, Tamil Nadu';

      const weather = await weatherService.getCurrentWeather(resolvedLocation, lat, lon);
      return successResponse(res, weather, 'Current live agro-weather retrieved');
    } catch (error) {
      console.error('[WeatherController] Error retrieving live weather:', error.message);
      return errorResponse(
        res,
        error.message || 'Unable to retrieve live weather data',
        'WEATHER_API_ERROR',
        503
      );
    }
  }

  async getForecast(req, res, next) {
    try {
      const { location, lat, lon, state, district } = req.query;
      const resolvedLocation =
        location || (district && state ? `${district}, ${state}` : 'Thanjavur, Tamil Nadu');

      const forecast = await weatherService.get7DayForecast(resolvedLocation, lat, lon);
      return successResponse(res, { forecast }, '7-Day agricultural live forecast retrieved');
    } catch (error) {
      console.error('[WeatherController] Error retrieving forecast:', error.message);
      return errorResponse(
        res,
        error.message || 'Unable to retrieve live forecast data',
        'FORECAST_API_ERROR',
        503
      );
    }
  }

  async searchLocation(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || !q.trim()) {
        return successResponse(res, { locations: [] }, 'No search query provided');
      }
      const locations = await weatherService.searchLocations(q);
      return successResponse(res, { locations }, 'Locations retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeatherController();
