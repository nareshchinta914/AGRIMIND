const prisma = require('../config/db');
const waterService = require('../services/waterAlgorithmService');
const { successResponse } = require('../utils/response');
const { waterSchema } = require('../validators/farmValidator');

class WaterController {
  /**
   * POST /api/water/recommendation
   */
  async getRecommendation(req, res, next) {
    try {
      const data = waterSchema.parse(req.body);
      const advice = waterService.calculateIrrigation(data);

      if (req.user) {
        await prisma.waterRecommendation.create({
          data: {
            userId: req.user.id,
            cropName: data.cropName,
            farmSize: data.farmSize,
            soilType: data.soilType,
            nextIrrigationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            durationMinutes: advice.durationMinutes,
            soilMoisture: advice.currentSoilMoisture,
            waterSavingTip: advice.waterSavingTip
          }
        });
      }

      return successResponse(res, { waterAdvice: advice }, 'Precision water schedule calculated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WaterController();
