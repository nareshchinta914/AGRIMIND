class CostCalculatorService {
  /**
   * Calculate detailed farm finances, cost per acre, gross revenue, net profit and break-even point
   */
  calculateFinancials({
    cropName = 'Paddy (Ponni)',
    acres = 5.0,
    seedCost = 12000,
    fertilizerCost = 28500,
    laborCost = 42000,
    dieselMachineryCost = 36000,
    expectedYieldQuintals = 140, // 28 qtl/acre * 5 acres
    expectedMandiPricePerQuintal = 2550
  }) {
    const totalCost = seedCost + fertilizerCost + laborCost + dieselMachineryCost;
    const costPerAcre = Math.round(totalCost / Math.max(1, acres));
    const expectedRevenue = expectedYieldQuintals * expectedMandiPricePerQuintal;
    const estimatedProfit = expectedRevenue - totalCost;
    const roiPercentage = Math.round((estimatedProfit / Math.max(1, totalCost)) * 100);
    const breakEvenYieldQuintals = Math.round((totalCost / expectedMandiPricePerQuintal) * 10) / 10;

    const breakdown = [
      { item: 'Certified Seeds & Nursery Prep', amount: seedCost, percentage: Math.round((seedCost / totalCost) * 100) },
      { item: 'NPK Fertilizers & Micronutrients', amount: fertilizerCost, percentage: Math.round((fertilizerCost / totalCost) * 100) },
      { item: 'Transplanting, Weeding & Field Labor', amount: laborCost, percentage: Math.round((laborCost / totalCost) * 100) },
      { item: 'Tractor Tillage & Harvester Machinery', amount: dieselMachineryCost, percentage: Math.round((dieselMachineryCost / totalCost) * 100) }
    ];

    return {
      cropName,
      acres,
      totalCost,
      costPerAcre,
      expectedRevenue,
      estimatedProfit,
      roiPercentage: `${roiPercentage}%`,
      breakEvenYield: `${breakEvenYieldQuintals} Quintals (Total) or ${(breakEvenYieldQuintals / acres).toFixed(1)} Qtl/Acre`,
      breakdown
    };
  }
}

module.exports = new CostCalculatorService();
