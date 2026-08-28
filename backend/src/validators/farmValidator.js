const { z } = require('zod');

const farmSchema = z.object({
  farmName: z.string().min(2, 'Farm name is required'),
  location: z.string().min(2, 'Location is required'),
  totalArea: z.number().positive('Total area must be positive'),
  soilType: z.string().min(2, 'Soil type is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

const cropRecommendationSchema = z.object({
  soilType: z.string().min(2, 'Soil type is required'),
  location: z.string().min(2, 'Location is required'),
  season: z.string().optional(),
  ph: z.number().optional(),
  organicCarbon: z.number().optional(),
  imageUrl: z.string().optional()
});

const waterSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  farmSize: z.number().positive('Farm size must be positive'),
  soilType: z.string().min(2, 'Soil type is required'),
  growthStage: z.string().default('Vegetative / Tillering'),
  temperature: z.number().optional(),
  rainfallProbability: z.number().optional()
});

const costSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  acres: z.number().positive('Acres must be positive'),
  seedCost: z.number().nonnegative(),
  fertilizerCost: z.number().nonnegative(),
  laborCost: z.number().nonnegative(),
  dieselMachineryCost: z.number().nonnegative(),
  expectedYieldQuintals: z.number().positive(),
  expectedMandiPricePerQuintal: z.number().positive()
});

const activitySchema = z.object({
  title: z.string().min(2, 'Activity title is required'),
  activityType: z.enum(['SOWING', 'FERTILIZER', 'IRRIGATION', 'PESTICIDE', 'HARVEST', 'OTHER']),
  plotName: z.string().min(2, 'Plot name is required'),
  scheduledDate: z.string().min(2, 'Scheduled date is required'),
  scheduledTime: z.string().min(2, 'Scheduled time is required'),
  details: z.string().optional()
});

module.exports = {
  farmSchema,
  cropRecommendationSchema,
  waterSchema,
  costSchema,
  activitySchema
};
