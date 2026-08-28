const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting AGRIMIND API Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Test 1: GET /api/health — PASSED:', res.data.status);
    passed++;
  } catch (err) {
    console.error('❌ Test 1: GET /api/health — FAILED:', err.message);
    failed++;
  }

  // Test 2: Current Weather
  try {
    const res = await axios.get(`${BASE_URL}/weather/current?location=Thanjavur`);
    console.log('✅ Test 2: GET /api/weather/current — PASSED:', res.data.weather.condition, res.data.weather.temperature + '°C');
    passed++;
  } catch (err) {
    console.error('❌ Test 2: GET /api/weather/current — FAILED:', err.message);
    failed++;
  }

  // Test 3: 7-Day Weather Forecast
  try {
    const res = await axios.get(`${BASE_URL}/weather/forecast?location=Thanjavur`);
    console.log('✅ Test 3: GET /api/weather/forecast — PASSED:', res.data.forecast.length, 'days forecast');
    passed++;
  } catch (err) {
    console.error('❌ Test 3: GET /api/weather/forecast — FAILED:', err.message);
    failed++;
  }

  // Test 4: Crop Recommendations
  try {
    const res = await axios.post(`${BASE_URL}/recommendations/crop`, {
      soilType: 'Alluvial Loam',
      location: 'Thanjavur',
      ph: 6.8
    });
    console.log('✅ Test 4: POST /api/recommendations/crop — PASSED:', res.data.recommendation.soilType, 'Top crop:', res.data.recommendation.recommendedCrops[0]?.name);
    passed++;
  } catch (err) {
    console.error('❌ Test 4: POST /api/recommendations/crop — FAILED:', err.message);
    failed++;
  }

  // Test 5: Precision Irrigation Water Advice
  try {
    const res = await axios.post(`${BASE_URL}/water/recommendation`, {
      cropName: 'Paddy',
      farmSize: 5.0,
      soilType: 'alluvial',
      growthStage: 'Tillering'
    });
    console.log('✅ Test 5: POST /api/water/recommendation — PASSED:', res.data.waterAdvice.nextIrrigationTime, 'Volume:', res.data.waterAdvice.waterVolumeLiters + 'L');
    passed++;
  } catch (err) {
    console.error('❌ Test 5: POST /api/water/recommendation — FAILED:', err.message);
    failed++;
  }

  // Test 6: Farm Financials & ROI Cost Calculator
  try {
    const res = await axios.post(`${BASE_URL}/costs/calculate`, {
      cropName: 'Paddy (Ponni)',
      acres: 5.0,
      seedCost: 12000,
      fertilizerCost: 28500,
      laborCost: 42000,
      dieselMachineryCost: 36000,
      expectedYieldQuintals: 140,
      expectedMandiPricePerQuintal: 2550
    });
    console.log('✅ Test 6: POST /api/costs/calculate — PASSED: Total Cost: ₹' + res.data.financials.totalCost, 'Estimated Net Profit: ₹' + res.data.financials.estimatedProfit, 'ROI:', res.data.financials.roiPercentage);
    passed++;
  } catch (err) {
    console.error('❌ Test 6: POST /api/costs/calculate — FAILED:', err.message);
    failed++;
  }

  // Test 7: Live Mandi Vegetable & Crop Prices
  try {
    const res = await axios.get(`${BASE_URL}/market/mandi-prices?category=Vegetables`);
    const count = res.data.prices.length;
    console.log('✅ Test 7: GET /api/market/mandi-prices?category=Vegetables — PASSED:', count, 'vegetable commodities loaded, Top item:', res.data.prices[0]?.commodity);
    passed++;
  } catch (err) {
    console.error('❌ Test 7: GET /api/market/mandi-prices — FAILED:', err.message);
    failed++;
  }

  // Test 8: Verified Buying Merchants & Supermarket Aggregators
  try {
    const res = await axios.get(`${BASE_URL}/market/merchants?category=Vegetables`);
    const count = res.data.merchants.length;
    console.log('✅ Test 8: GET /api/market/merchants?category=Vegetables — PASSED:', count, 'vegetable merchants loaded, Top buyer:', res.data.merchants[0]?.companyName);
    passed++;
  } catch (err) {
    console.error('❌ Test 8: GET /api/market/merchants — FAILED:', err.message);
    failed++;
  }

  console.log(`\n==============================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==============================================\n`);
}

runTests();
