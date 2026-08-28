const prisma = require('../config/db');
const costCalculator = require('../services/costCalculatorService');
const { successResponse, errorResponse } = require('../utils/response');
const { costSchema } = require('../validators/farmValidator');

class CostController {
  /**
   * POST /api/costs/calculate
   */
  async calculate(req, res, next) {
    try {
      const data = costSchema.parse(req.body);
      const financials = costCalculator.calculateFinancials(data);
      return successResponse(res, { financials }, 'Farm cost & profit calculated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/costs
   */
  async saveCost(req, res, next) {
    try {
      const data = costSchema.parse(req.body);
      const financials = costCalculator.calculateFinancials(data);
      const userId = Number(req.user?.id) || 1;

      const record = await prisma.farmCost.create({
        data: {
          userId,
          cropName: data.cropName,
          totalCost: financials.totalCost,
          costPerAcre: financials.costPerAcre,
          expectedRevenue: financials.expectedRevenue,
          estimatedProfit: financials.estimatedProfit,
          breakEvenYield: financials.breakEvenYield,
          breakdownJson: JSON.stringify(financials.breakdown)
        }
      });

      return successResponse(res, { costRecord: record, financials }, 'Farm cost saved', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/costs
   */
  async getCosts(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const costs = await prisma.farmCost.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return successResponse(res, { costs }, 'Farm costs retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/costs/:id
   */
  async getCostById(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const cost = await prisma.farmCost.findFirst({
        where: { id: Number(req.params.id), userId }
      });
      if (!cost) return errorResponse(res, 'Cost record not found', 'NOT_FOUND', 404);
      return successResponse(res, { cost }, 'Cost record retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/costs/:id
   */
  async updateCost(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const record = await prisma.farmCost.updateMany({
        where: { id: Number(req.params.id), userId },
        data: req.body
      });
      if (record.count === 0) return errorResponse(res, 'Record not found', 'NOT_FOUND', 404);
      return successResponse(res, {}, 'Cost record updated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/costs/:id
   */
  async deleteCost(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const record = await prisma.farmCost.deleteMany({
        where: { id: Number(req.params.id), userId }
      });
      if (record.count === 0) return errorResponse(res, 'Record not found', 'NOT_FOUND', 404);
      return successResponse(res, {}, 'Cost record deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CostController();
