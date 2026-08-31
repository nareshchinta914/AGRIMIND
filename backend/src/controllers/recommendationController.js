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

  /**
   * POST /api/recommendations/analyze-soil-image
   * Validates whether an image contains clear agricultural soil before generating crop advice
   */
  async analyzeSoilImage(req, res, next) {
    try {
      const { image, location = 'Thanjavur, Tamil Nadu', language = 'en' } = req.body;

      if (!image) {
        return errorResponse(res, 'Image is not clear enough. Please capture a clear photo of the soil and try again.', 'POOR_QUALITY', 400);
      }

      // If Vision AI is configured, validate with AI Vision prompt
      if (env.GEMINI_API_KEY) {
        try {
          const geminiPrompt = `
You are an expert Agricultural Soil Scientist and Computer Vision classifier.
Analyze this photo strictly for Agricultural Soil and Crop Recommendation.

STRICT INSTRUCTIONS:
Step 1: Check if the image is clear and unobstructed.
Step 2: Check if the image contains clearly visible agricultural soil.
REJECT if the image contains:
- Humans, faces, hands
- Leaves, grass, trees, flowers, plants (without clear bare soil)
- Animals or pets
- Buildings, walls, floors, tiles, concrete, roads
- Vehicles or machinery
- Sky, clouds, water
- Food, fruits, vegetables
- Electronics, screens, screenshots, random objects

Output JSON only in this exact format:
{
  "isValid": true | false,
  "isSoil": true | false,
  "status": "SUCCESS" | "NOT_SOIL" | "POOR_QUALITY" | "INSUFFICIENT_SOIL",
  "soilType": "alluvial" | "black" | "red" | "laterite",
  "confidence": 95,
  "rejectionReason": "..." (only if rejected)
}
`.trim();

          const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

          const visionRes = await axios.post(
            geminiUrl,
            {
              contents: [
                {
                  parts: [
                    { text: geminiPrompt },
                    {
                      inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
              }
            },
            { timeout: 6000 }
          );

          const resultJson = JSON.parse(visionRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
          if (resultJson && resultJson.status) {
            if (!resultJson.isSoil || resultJson.status === 'NOT_SOIL') {
              return successResponse(res, {
                isValid: false,
                isSoil: false,
                status: 'NOT_SOIL',
                message: 'This image does not appear to contain soil. Please capture a clear photo of the soil.'
              });
            }

            if (resultJson.status === 'INSUFFICIENT_SOIL') {
              return successResponse(res, {
                isValid: false,
                isSoil: false,
                status: 'INSUFFICIENT_SOIL',
                message: 'Insufficient soil information. Please capture a closer and clearer photo of the soil.'
              });
            }

            if (resultJson.status === 'POOR_QUALITY' || !resultJson.isValid) {
              return successResponse(res, {
                isValid: false,
                isSoil: false,
                status: 'POOR_QUALITY',
                message: 'Image is not clear enough. Please capture a clear photo of the soil and try again.'
              });
            }

            // Valid Soil: Generate recommendations
            const soilKey = resultJson.soilType || 'alluvial';
            const recommendations = cropEngine.recommendCrops({ soilType: soilKey, location });

            return successResponse(res, {
              isValid: true,
              isSoil: true,
              status: 'SUCCESS',
              confidence: resultJson.confidence || 95,
              soilType: soilKey,
              recommendations
            });
          }
        } catch (visionErr) {
          console.warn('[Backend] Vision AI fallback:', visionErr.message);
        }
      }

      // Default client-side verified response
      return successResponse(res, {
        status: 'READY_FOR_CLIENT_PIXEL_EVALUATION',
        message: 'Proceed with client-side pixel evaluation'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RecommendationController();
