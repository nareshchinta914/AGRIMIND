class CropEngineService {
  /**
   * Recommend crops based on soil, location, NPK and season
   */
  recommendCrops({ soilType = 'alluvial', location = 'Thanjavur', ph = 6.8, season = 'Kharif' }) {
    const soil = soilType.toLowerCase();

    if (soil.includes('alluvial') || soil.includes('loam')) {
      return {
        soilType: 'Alluvial Loam Soil',
        ph: ph || 6.8,
        phStatus: 'Optimal (Near Neutral)',
        organicCarbon: '0.78% (High)',
        nitrogen: '285 kg/ha (Medium)',
        phosphorus: '22 kg/ha (Medium)',
        potassium: '310 kg/ha (High)',
        recommendedCrops: [
          {
            name: 'Paddy / Rice (Ponni Samba)',
            variety: 'BPT-5204 / CR 1009 Sub-1',
            suitability: 98,
            duration: '135 - 145 Days',
            expectedYield: '24 - 28 Quintals/Acre',
            profit: '₹55,000 - ₹68,000 / Acre',
            fertilizer: 'Urea: 60kg + DAP: 45kg + MOP: 25kg + Zinc: 5kg/Acre',
            waterNeed: 'High'
          },
          {
            name: 'Hybrid Maize / Corn',
            variety: 'NK 6240 / Pioneer 30V92',
            suitability: 94,
            duration: '105 - 115 Days',
            expectedYield: '30 - 36 Quintals/Acre',
            profit: '₹42,000 - ₹52,000 / Acre',
            fertilizer: 'Urea: 65kg + DAP: 40kg + Potash: 30kg/Acre',
            waterNeed: 'Moderate'
          },
          {
            name: 'Organic Black Gram / Urad Dal',
            variety: 'VBN 6 / VBN 8',
            suitability: 92,
            duration: '65 - 70 Days',
            expectedYield: '6 - 8 Quintals/Acre',
            profit: '₹38,000 - ₹48,000 / Acre',
            fertilizer: 'DAP: 25kg + Rhizobium seed inoculant',
            waterNeed: 'Low'
          }
        ]
      };
    }

    if (soil.includes('black') || soil.includes('regur')) {
      return {
        soilType: 'Black Regur Soil (Deep Clay)',
        ph: ph || 7.8,
        phStatus: 'Slightly Alkaline',
        organicCarbon: '0.62% (Medium)',
        nitrogen: '220 kg/ha (Low-Medium)',
        phosphorus: '18 kg/ha (Medium)',
        potassium: '340 kg/ha (Very High)',
        recommendedCrops: [
          {
            name: 'Bt Cotton (Long Staple)',
            variety: 'RCH 659 / Mallika',
            suitability: 96,
            duration: '150 - 160 Days',
            expectedYield: '14 - 18 Quintals/Acre',
            profit: '₹62,000 - ₹78,000 / Acre',
            fertilizer: 'Urea: 70kg + DAP: 50kg + Potash: 30kg/Acre',
            waterNeed: 'Moderate'
          },
          {
            name: 'Soybean',
            variety: 'JS 335 / JS 95-60',
            suitability: 93,
            duration: '95 - 100 Days',
            expectedYield: '10 - 12 Quintals/Acre',
            profit: '₹35,000 - ₹45,000 / Acre',
            fertilizer: 'DAP: 35kg + SSP: 50kg/Acre',
            waterNeed: 'Moderate'
          }
        ]
      };
    }

    // Default Fallback
    return {
      soilType: 'Red Loamy / Sandy Clay Soil',
      ph: ph || 6.2,
      phStatus: 'Slightly Acidic',
      organicCarbon: '0.55% (Medium)',
      nitrogen: '240 kg/ha (Medium)',
      phosphorus: '16 kg/ha (Low-Medium)',
      potassium: '260 kg/ha (Medium)',
      recommendedCrops: [
        {
          name: 'Groundnut / Peanut',
          variety: 'TMV 13 / Kadiri 6 / Dharani',
          suitability: 95,
          duration: '105 - 110 Days',
          expectedYield: '16 - 20 Quintals/Acre',
          profit: '₹48,000 - ₹58,000 / Acre',
          fertilizer: 'Gypsum: 200kg + DAP: 30kg + Potash: 30kg/Acre',
          waterNeed: 'Low to Moderate'
        },
        {
          name: 'Finger Millet (Ragi)',
          variety: 'GPU 28 / ML 365',
          suitability: 91,
          duration: '95 - 105 Days',
          expectedYield: '14 - 18 Quintals/Acre',
          profit: '₹28,000 - ₹36,000 / Acre',
          fertilizer: 'FYM Compost: 5 Tons + DAP: 20kg/Acre',
          waterNeed: 'Low'
        }
      ]
    };
  }
}

module.exports = new CropEngineService();
