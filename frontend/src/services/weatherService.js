import api from './api';

export const weatherService = {
  async getCurrentWeather(location = { state: 'Punjab', district: 'Ludhiana' }) {
    try {
      const response = await api.get('/weather/current', { params: location });
      return response.data;
    } catch (err) {
      return {
        location: `${location.district || 'Ludhiana'}, ${location.state || 'Punjab'}`,
        temperature: 29,
        condition: 'Partly Cloudy with Breeze',
        hindiCondition: 'हल्के बादल व सुहानी हवा',
        humidity: 62,
        windSpeed: '12 km/h NW',
        rainfallChance: 15,
        uvIndex: 'Moderate (5)',
        soilMoisture: '71% (Adequate for sowing)',
        sprayingAdvisory: 'Favorable (Wind speed is low, no heavy rain expected for 48 hrs)',
        forecast: [
          { day: 'Today', tempMax: 31, tempMin: 21, icon: 'partly-cloudy', rainProb: 15, advice: 'Ideal for fertilizer application' },
          { day: 'Tomorrow', tempMax: 32, tempMin: 22, icon: 'sunny', rainProb: 5, advice: 'Good day for intercultural operations' },
          { day: 'Thu', tempMax: 30, tempMin: 20, icon: 'cloud-rain', rainProb: 45, advice: 'Delay foliar pesticide spray' },
          { day: 'Fri', tempMax: 29, tempMin: 19, icon: 'rain', rainProb: 70, advice: 'Hold irrigation, light showers expected' },
          { day: 'Sat', tempMax: 28, tempMin: 19, icon: 'sunny', rainProb: 10, advice: 'Resume normal field monitoring' }
        ]
      };
    }
  },

  async getWaterAdvisory(farmDetails) {
    try {
      const response = await api.post('/weather/water-advisory', farmDetails);
      return response.data;
    } catch (err) {
      return {
        nextIrrigationDueInDays: 3,
        suggestedAmountMm: 45,
        savingPercentageWithDrip: 42,
        schedule: [
          { time: '06:00 AM - 09:00 AM', method: 'Drip / Sprinkler', reason: 'Lowest evaporation loss' },
          { time: '05:00 PM - 07:00 PM', method: 'Furrow', reason: 'Secondary option for dry patches' }
        ],
        alerts: [
          'Soil moisture at root depth (15cm) is currently optimal.',
          'Forecasted rain on Thursday may provide 12-15mm natural hydration.'
        ]
      };
    }
  }
};
