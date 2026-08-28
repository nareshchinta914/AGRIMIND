const weatherService = require('../services/weatherApiService');
const { successResponse } = require('../utils/response');

class WeatherController {
  async getCurrent(req, res, next) {
    try {
      const { location, lat, lon } = req.query;
      const weather = await weatherService.getCurrentWeather(location, lat, lon);
      return successResponse(res, { weather }, 'Current agro-weather retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getForecast(req, res, next) {
    try {
      const { location } = req.query;
      const forecast = await weatherService.get7DayForecast(location);
      return successResponse(res, { forecast }, '7-Day agricultural forecast retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeatherController();
