import api from './api';

export const marketService = {
  /**
   * Fetch Live APMC Mandi commodity & crop prices with filtering
   */
  async getMandiPrices(filters = {}) {
    try {
      const response = await api.get('/market/mandi-prices', { params: filters });
      return {
        total: response?.total || response?.prices?.length || 0,
        source: response?.source || 'AGMARKNET • Directorate of Marketing & Inspection (Govt of India)',
        lastUpdatedFormatted: response?.lastUpdatedFormatted || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        prices: response?.prices || []
      };
    } catch (err) {
      console.warn('[marketService] Backend mandi prices fallback:', err.message);
      return {
        total: 0,
        source: 'AGMARKNET • Directorate of Marketing & Inspection (Govt of India)',
        lastUpdatedFormatted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        prices: []
      };
    }
  },

  /**
   * Get dynamic filter options for Crop, State, District, Market
   */
  async getFilterOptions() {
    try {
      const response = await api.get('/market/filter-options');
      return response || {
        crops: ['All', 'Tomato', 'Onion', 'Potato', 'Paddy (Rice / Dhan)', 'Wheat (Gehun)', 'Cotton (Kapas)', 'Red Chilli (Dry)', 'Turmeric (Finger)'],
        states: ['All', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Gujarat'],
        districts: ['All', 'Thanjavur', 'Chennai', 'Dindigul', 'Chittoor', 'Kolar', 'Nashik', 'Ludhiana', 'Agra', 'Rajkot'],
        markets: ['All', 'Thanjavur APMC Yard', 'Koyambedu Wholesale Market', 'Madanapalle Mandi', 'Lasalgaon Mandi', 'Khanna Mandi'],
        categories: ['All', 'Vegetables', 'Grains & Cereals', 'Cash Crops & Fiber', 'Spices', 'Oilseeds']
      };
    } catch (err) {
      return {
        crops: ['All', 'Tomato', 'Onion', 'Potato', 'Paddy (Rice / Dhan)', 'Wheat (Gehun)', 'Cotton (Kapas)', 'Red Chilli (Dry)', 'Turmeric (Finger)'],
        states: ['All', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Gujarat'],
        districts: ['All', 'Thanjavur', 'Chennai', 'Dindigul', 'Chittoor', 'Kolar', 'Nashik', 'Ludhiana', 'Agra', 'Rajkot'],
        markets: ['All', 'Thanjavur APMC Yard', 'Koyambedu Wholesale Market', 'Madanapalle Mandi', 'Lasalgaon Mandi', 'Khanna Mandi'],
        categories: ['All', 'Vegetables', 'Grains & Cereals', 'Cash Crops & Fiber', 'Spices', 'Oilseeds']
      };
    }
  },

  /**
   * Lookup specific crop price
   */
  async getCropPrice(crop, location = '') {
    try {
      const response = await api.get('/market/crop-price', { params: { crop, location } });
      return response?.priceData || null;
    } catch (err) {
      return null;
    }
  },

  /**
   * Fetch verified bulk buyers & millers
   */
  async getBuyingMerchants(params = {}) {
    try {
      const response = await api.get('/market/merchants', { params });
      return {
        totalMerchants: response?.totalMerchants || response?.merchants?.length || 0,
        merchants: response?.merchants || []
      };
    } catch (err) {
      return { totalMerchants: 0, merchants: [] };
    }
  },

  /**
   * Post farmer produce listing
   */
  async postFarmerProduce(produceData) {
    try {
      const response = await api.post('/market/farmer-sell', produceData);
      return response;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Direct farm listings
   */
  async getMarketListings() {
    return {
      listings: [
        {
          id: 'list_1',
          title: 'Solar Powered Drip Irrigation Controller & Valves',
          category: 'Equipment',
          price: 14500,
          unit: 'Complete Kit',
          farmerName: 'M. Ramesh (Erode)',
          phone: '9842112233',
          rating: '4.9',
          description: 'Fully automated 4-valve solar drip timer with smartphone Bluetooth remote control.'
        },
        {
          id: 'list_2',
          title: 'Certified High Yield Tomato Seeds (Hybrid Red Arka Rakshak)',
          category: 'Seeds',
          price: 850,
          unit: 'Pack (50g)',
          farmerName: 'Green Bio Agri Seeds',
          phone: '9876543210',
          rating: '5.0',
          description: 'Triple disease resistant (ToLCV, Early Blight, Bacterial Wilt) F1 hybrid seeds. Yield 35-40 tons/acre.'
        },
        {
          id: 'list_3',
          title: 'Organic Neem Oil (10,000 PPM Cold Pressed Pest Repellent)',
          category: 'Bio-Fertilizer',
          price: 650,
          unit: 'Can (5 Liters)',
          farmerName: 'Veda Organic Agro',
          phone: '9443211224',
          rating: '4.8',
          description: '100% natural cold pressed neem kernel oil for pest defense against whitefly, thrips, and aphids.'
        }
      ]
    };
  }
};
