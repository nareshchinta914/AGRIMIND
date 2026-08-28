const axios = require('axios');
const prisma = require('../config/db');
const env = require('../config/env');
const cropEngine = require('../services/cropEngineService');
const { successResponse, errorResponse } = require('../utils/response');
const { cropRecommendationSchema } = require('../validators/farmValidator');

class RecommendationController {
  /**
   * POST /api/recommendations/crop
   * Recommends optimal crops using FastAPI ML model + saves history to PostgreSQL
   */
  async recommendCrop(req, res, next) {
    try {
      const data = cropRecommendationSchema.parse(req.body);
      let recommendation = null;

      // 1. Try invoking Python FastAPI Scikit-learn Service
      try {
        const mlPayload = {
          nitrogen: data.nitrogen || 80.0,
          phosphorus: data.phosphorus || 45.0,
          potassium: data.potassium || 40.0,
          ph: data.ph || 6.8,
          temperature: data.temperature || 26.0,
          humidity: data.humidity || 75.0,
          rainfall: data.rainfall || 180.0,
          soil_type: data.soilType || 'alluvial',
          season: data.season || 'kharif'
        };

        const aiResponse = await axios.post(`${env.AI_SERVICE_URL}/predict/crop`, mlPayload, { timeout: 4000 });
        if (aiResponse.data && aiResponse.data.predicted_crop) {
          recommendation = {
            soilType: data.soilType,
            predictedCrop: aiResponse.data.predicted_crop,
            confidenceScore: aiResponse.data.confidence_score,
            recommendedCrops: aiResponse.data.all_recommendations.map((r) => ({
              name: r.crop,
              variety: r.crop.split('(')[1]?.replace(')', '') || 'High-Yield Hybrid',
              suitability: r.confidence,
              expectedYield: r.expected_yield,
              duration: '120 - 135 Days',
              profit: r.market_outlook,
              fertilizer: r.fertilizer_plan,
              waterNeed: r.water_requirement
            })),
            modelType: aiResponse.data.model_type
          };
        }
      } catch (aiErr) {
        console.warn('[Backend] AI Service call skipped/fallback:', aiErr.message);
      }

      // 2. Fallback to Agronomic Rule Engine
      if (!recommendation) {
        recommendation = cropEngine.recommendCrops(data);
      }

      // 3. Save recommendation log to database
      if (req.user) {
        await prisma.cropRecommendation.create({
          data: {
            userId: req.user.id,
            soilType: data.soilType,
            location: data.location,
            recommendedCrop: recommendation.recommendedCrops?.[0]?.name || 'Paddy',
            confidenceScore: 0.96,
            npkRecommendation: `N: 80kg, P: 45kg, K: 40kg`,
            yieldForecast: recommendation.recommendedCrops?.[0]?.expectedYield,
            profitForecast: recommendation.recommendedCrops?.[0]?.profit,
            imageUrl: data.imageUrl || null
          }
        });
      }

      return successResponse(res, { recommendation }, 'Crop recommendations generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendationController();
