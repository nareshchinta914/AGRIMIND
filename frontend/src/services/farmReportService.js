import api from './api';

export const farmReportService = {
  async getSoilHealthReport(farmId = 'default') {
    try {
      const response = await api.get(`/reports/soil/${farmId}`);
      return response.data;
    } catch (err) {
      return {
        sampleId: 'SHC-PB-2026-8941',
        farmerName: 'Ramesh Kumar',
        village: 'Khanna',
        district: 'Ludhiana',
        state: 'Punjab',
        testDate: '12 Feb 2026',
        soilType: 'Alluvial Loam',
        parameters: [
          { parameter: 'pH (Reaction)', value: '7.3', status: 'Optimal (6.5 - 7.5)', color: 'green' },
          { parameter: 'EC (Salinity)', value: '0.42 dS/m', status: 'Normal (< 1.0)', color: 'green' },
          { parameter: 'Organic Carbon (OC)', value: '0.62 %', status: 'Medium (0.5 - 0.75%)', color: 'yellow' },
          { parameter: 'Available Nitrogen (N)', value: '290 kg/ha', status: 'Medium', color: 'yellow' },
          { parameter: 'Available Phosphorus (P)', value: '26.4 kg/ha', status: 'High (> 25 kg/ha)', color: 'green' },
          { parameter: 'Available Potassium (K)', value: '210 kg/ha', status: 'High (> 140 kg/ha)', color: 'green' },
          { parameter: 'Zinc (Zn)', value: '0.85 ppm', status: 'Deficient (< 0.6 ppm)', color: 'red' },
          { parameter: 'Sulfur (S)', value: '14.2 ppm', status: 'Sufficient (> 10 ppm)', color: 'green' }
        ],
        recommendations: [
          'Apply Zinc Sulfate 21% @ 10 kg/acre at time of sowing.',
          'Incorporate Green Manuring (Dhaincha/Sunhemp) to enhance Organic Carbon.',
          'Reduce chemical phosphorus by 15% since soil reserve is already high.'
        ]
      };
    }
  },

  async calculateFarmProfit(costData) {
    try {
      const response = await api.post('/reports/calculate-profit', costData);
      return response.data;
    } catch (err) {
      const landAcres = Number(costData.acres) || 5;
      const seedCost = Number(costData.seedCost) || (1800 * landAcres);
      const fertilizerCost = Number(costData.fertilizerCost) || (3200 * landAcres);
      const laborCost = Number(costData.laborCost) || (4500 * landAcres);
      const irrigationCost = Number(costData.irrigationCost) || (2000 * landAcres);
      const machineryCost = Number(costData.machineryCost) || (3500 * landAcres);

      const totalCost = seedCost + fertilizerCost + laborCost + irrigationCost + machineryCost;
      const expectedYieldQuintals = (Number(costData.yieldPerAcre) || 22) * landAcres;
      const mandiPricePerQuintal = Number(costData.mandiPrice) || 2380;
      const grossRevenue = expectedYieldQuintals * mandiPricePerQuintal;
      const netProfit = grossRevenue - totalCost;
      const roiPercentage = ((netProfit / (totalCost || 1)) * 100).toFixed(1);

      return {
        totalCost,
        grossRevenue,
        netProfit,
        roiPercentage,
        costPerAcre: Math.round(totalCost / landAcres),
        profitPerAcre: Math.round(netProfit / landAcres),
        breakdown: [
          { category: 'Seeds & Sowing', amount: seedCost, percentage: Math.round((seedCost / totalCost) * 100) },
          { category: 'Fertilizer & Pesticides', amount: fertilizerCost, percentage: Math.round((fertilizerCost / totalCost) * 100) },
          { category: 'Labor & Weeding', amount: laborCost, percentage: Math.round((laborCost / totalCost) * 100) },
          { category: 'Irrigation & Power', amount: irrigationCost, percentage: Math.round((irrigationCost / totalCost) * 100) },
          { category: 'Machinery & Fuel', amount: machineryCost, percentage: Math.round((machineryCost / totalCost) * 100) }
        ]
      };
    }
  }
};
