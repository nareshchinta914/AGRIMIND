const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

class CropController {
  async getCrops(req, res, next) {
    try {
      const { category, search } = req.query;
      const crops = await prisma.crop.findMany({
        where: {
          ...(category && { category }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { suitableSoil: { contains: search, mode: 'insensitive' } }
            ]
          })
        }
      });
      return successResponse(res, { crops }, 'Crops retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getCropById(req, res, next) {
    try {
      const crop = await prisma.crop.findUnique({
        where: { id: Number(req.params.id) }
      });
      if (!crop) return errorResponse(res, 'Crop not found', 'NOT_FOUND', 404);
      return successResponse(res, { crop }, 'Crop details retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CropController();
