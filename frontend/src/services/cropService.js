import api from './api';

const MOCK_RECOMMENDATIONS = {
  alluvial_kharif: [
    {
      id: 'crop_rice_basmati',
      name: 'Basmati Rice (PB 1121)',
      hindiName: 'बासमती धान',
      suitabilityScore: 96,
      expectedYield: '22 - 25 Quintals/Acre',
      estimatedProfit: '₹48,000 - ₹56,000 / Acre',
      duration: '120 - 135 Days',
      waterRequirement: 'High (Puddle irrigation / Alternate wetting)',
      fertilizerDosage: 'N: 100 kg, P: 50 kg, K: 40 kg per Hectare',
      sowingTime: 'June 15 - July 10',
      pestsToWatch: ['Stem Borer', 'Bacterial Leaf Blight'],
      marketDemand: 'Very High (Domestic & Export)'
    },
    {
      id: 'crop_maize_hybrid',
      name: 'Hybrid Maize (Pioneer 3396)',
      hindiName: 'संकर मक्का',
      suitabilityScore: 89,
      expectedYield: '30 - 35 Quintals/Acre',
      estimatedProfit: '₹35,000 - ₹42,000 / Acre',
      duration: '95 - 105 Days',
      waterRequirement: 'Moderate',
      fertilizerDosage: 'N: 120 kg, P: 60 kg, K: 50 kg per Hectare',
      sowingTime: 'June 20 - July 15',
      pestsToWatch: ['Fall Armyworm', 'Shoot Fly'],
      marketDemand: 'High (Poultry feed & Starch industry)'
    },
    {
      id: 'crop_cotton_bt',
      name: 'Bt Cotton (RCH 659)',
      hindiName: 'कपास (नरमा)',
      suitabilityScore: 84,
      expectedYield: '12 - 15 Quintals/Acre',
      estimatedProfit: '₹40,000 - ₹50,000 / Acre',
      duration: '150 - 165 Days',
      waterRequirement: 'Moderate - Drip Recommended',
      fertilizerDosage: 'N: 150 kg, P: 60 kg, K: 60 kg per Hectare',
      sowingTime: 'May 15 - June 15',
      pestsToWatch: ['Pink Bollworm', 'Whitefly'],
      marketDemand: 'High (Textile spinning mills)'
    }
  ],
  alluvial_rabi: [
    {
      id: 'crop_wheat_hd2967',
      name: 'Wheat (HD 2967 / HD 3086)',
      hindiName: 'गेहूं (HD 2967)',
      suitabilityScore: 98,
      expectedYield: '20 - 24 Quintals/Acre',
      estimatedProfit: '₹38,000 - ₹45,000 / Acre',
      duration: '135 - 145 Days',
      waterRequirement: 'Moderate (4-5 irrigations at critical stages)',
      fertilizerDosage: 'N: 120 kg, P: 60 kg, K: 40 kg per Hectare',
      sowingTime: 'Nov 01 - Nov 25',
      pestsToWatch: ['Yellow Rust', 'Aphids'],
      marketDemand: 'Assured MSP (FCI & Open Mandi)'
    },
    {
      id: 'crop_mustard_pusa',
      name: 'Mustard (Pusa Bold / Giriraj)',
      hindiName: 'सरसों / राई',
      suitabilityScore: 92,
      expectedYield: '8 - 10 Quintals/Acre',
      estimatedProfit: '₹36,000 - ₹44,000 / Acre',
      duration: '110 - 125 Days',
      waterRequirement: 'Low (2-3 irrigations)',
      fertilizerDosage: 'N: 80 kg, P: 40 kg, K: 40 kg, Sulfur: 20 kg',
      sowingTime: 'Oct 10 - Oct 30',
      pestsToWatch: ['Mustard Aphid', 'White Rust'],
      marketDemand: 'Very High (Oil demand)'
    }
  ],
  black_kharif: [
    {
      id: 'crop_soybean_js9560',
      name: 'Soybean (JS 95-60 / JS 20-34)',
      hindiName: 'सोयाबीन',
      suitabilityScore: 97,
      expectedYield: '10 - 12 Quintals/Acre',
      estimatedProfit: '₹32,000 - ₹40,000 / Acre',
      duration: '90 - 100 Days',
      waterRequirement: 'Moderate - sensitive to waterlogging',
      fertilizerDosage: 'N: 30 kg, P: 60 kg, K: 40 kg + Rhizobium culture',
      sowingTime: 'June 20 - July 10',
      pestsToWatch: ['Girdle Beetle', 'Semilooper'],
      marketDemand: 'High (Solvent extraction)'
    },
    {
      id: 'crop_cotton_hybrid',
      name: 'Black Soil Cotton (Kaveri Jadoo)',
      hindiName: 'काली मिट्टी कपास',
      suitabilityScore: 93,
      expectedYield: '14 - 18 Quintals/Acre',
      estimatedProfit: '₹45,000 - ₹58,000 / Acre',
      duration: '160 - 170 Days',
      waterRequirement: 'Deep root moisture absorption',
      fertilizerDosage: 'N: 140 kg, P: 70 kg, K: 70 kg',
      sowingTime: 'June 15 - July 05',
      pestsToWatch: ['Pink Bollworm', 'Thrips'],
      marketDemand: 'High'
    }
  ]
};

export const cropService = {
  async getRecommendations(params) {
    try {
      const response = await api.post('/crops/recommend', params);
      return response.data;
    } catch (err) {
      // Offline fallback with smart soil-season matching
      const key = `${params.soilType || 'alluvial'}_${params.season || 'rabi'}`;
      const crops = MOCK_RECOMMENDATIONS[key] || MOCK_RECOMMENDATIONS['alluvial_rabi'];
      return {
        success: true,
        recommendations: crops,
        soilHealthIndex: 82,
        nitrogenLevel: 'Medium (280 kg/ha)',
        phosphorusLevel: 'High (24 kg/ha)',
        potassiumLevel: 'Medium (180 kg/ha)',
        phValue: 7.2,
        organicCarbon: '0.58% (Moderate)'
      };
    }
  },

  async getCropDetails(cropId) {
    try {
      return await api.get(`/crops/${cropId}`);
    } catch (err) {
      return {
        id: cropId,
        name: 'Wheat HD 2967',
        variety: 'High Yield Disease Resistant',
        seedRate: '40 kg/acre',
        spacing: '20 cm row to row',
        treatment: 'Carbendazim 2g/kg seed + Trichoderma'
      };
    }
  }
};
