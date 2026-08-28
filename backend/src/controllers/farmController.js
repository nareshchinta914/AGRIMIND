const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { farmSchema } = require('../validators/farmValidator');

class FarmController {
  async getFarms(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const farms = await prisma.farm.findMany({
        where: { userId }
      });
      return successResponse(res, { farms }, 'Farms retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createFarm(req, res, next) {
    try {
      const data = farmSchema.parse(req.body);
      const userId = Number(req.user?.id) || 1;
      const farm = await prisma.farm.create({
        data: {
          ...data,
          userId
        }
      });
      return successResponse(res, { farm }, 'Farm added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getFarmById(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const farm = await prisma.farm.findFirst({
        where: { id: Number(req.params.id), userId }
      });
      if (!farm) return errorResponse(res, 'Farm not found', 'NOT_FOUND', 404);
      return successResponse(res, { farm }, 'Farm details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateFarm(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const farm = await prisma.farm.updateMany({
        where: { id: Number(req.params.id), userId },
        data: req.body
      });
      if (farm.count === 0) return errorResponse(res, 'Farm not found or unauthorized', 'NOT_FOUND', 404);
      return successResponse(res, {}, 'Farm updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteFarm(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const result = await prisma.farm.deleteMany({
        where: { id: Number(req.params.id), userId }
      });
      if (result.count === 0) return errorResponse(res, 'Farm not found', 'NOT_FOUND', 404);
      return successResponse(res, {}, 'Farm deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FarmController();
