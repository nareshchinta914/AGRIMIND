import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Droplets,
  CloudSun,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Info,
  Calendar,
  Layers,
  Camera,
  Upload
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import WeatherWidget from '../components/cards/WeatherWidget';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SoilScannerModal from '../components/soil/SoilScannerModal';
import { cropService } from '../services/cropService';
import { farmReportService } from '../services/farmReportService';
import { weatherService } from '../services/weatherService';
import { useLocation } from '../hooks/useLocation';
import { useToast } from '../hooks/useToast';
import { SOIL_TYPES, SEASONS, INDIAN_STATES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const FeaturesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'crops';
  const { selectedState, selectedDistrict } = useLocation();
  const { toast } = useToast();
  const [isSoilScannerOpen, setIsSoilScannerOpen] = useState(false);

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // --- CROP RECOMMENDATION STATE ---
  const [cropForm, setCropForm] = useState({
    state: searchParams.get('state') || selectedState || 'Punjab',
    season: searchParams.get('season') || 'rabi',
    soilType: searchParams.get('soil') || 'alluvial',
    landSize: 5,
  });
  const [cropResults, setCropResults] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);

  const handleRecommend = async (e) => {
    e?.preventDefault();
    setCropLoading(true);
    try {
      const data = await cropService.getRecommendations(cropForm);
      setCropResults(data);
      toast.success('AI crop recommendation generated for your soil profile!');
    } catch (err) {
      toast.error('Failed to get recommendations');
    } finally {
      setCropLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'crops' && !cropResults) {
      handleRecommend();
    }
  }, [activeTab]);

  // --- WATER ADVICE STATE ---
  const [waterForm, setWaterForm] = useState({
    crop: 'Wheat',
    irrigationType: 'drip',
    landAcres: 5,
  });
  const [waterAdvice, setWaterAdvice] = useState(null);
  const [waterLoading, setWaterLoading] = useState(false);

  const handleWaterAdvisory = async (e) => {
    e?.preventDefault();
    setWaterLoading(true);
    try {
      const data = await weatherService.getWaterAdvisory(waterForm);
      setWaterAdvice(data);
    } catch (err) {
      toast.error('Failed to load water advice');
    } finally {
      setWaterLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'water' && !waterAdvice) {
      handleWaterAdvisory();
    }
  }, [activeTab]);

  // --- FARM COST CALCULATOR STATE ---
  const [costForm, setCostForm] = useState({
    cropName: 'Wheat HD 2967',
    acres: 5,
    seedCost: 9000,
    fertilizerCost: 16000,
    laborCost: 22500,
    irrigationCost: 10000,
    machineryCost: 17500,
    yieldPerAcre: 22,
    mandiPrice: 2380,
  });
  const [profitReport, setProfitReport] = useState(null);
  const [costLoading, setCostLoading] = useState(false);

  const handleCalculateCost = async (e) => {
    e?.preventDefault();
    setCostLoading(true);
    try {
      const data = await farmReportService.calculateFarmProfit(costForm);
      setProfitReport(data);
    } catch (err) {
      toast.error('Error calculating profit');
    } finally {
      setCostLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'cost' && !profitReport) {
      handleCalculateCost();
    }
  }, [activeTab]);

  // --- SOIL HEALTH REPORT STATE ---
  const [soilReport, setSoilReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const loadSoilReport = async () => {
      setReportLoading(true);
      try {
        const data = await farmReportService.getSoilHealthReport();
        setSoilReport(data);
      } catch (err) {
        toast.error('Failed to load soil report');
      } finally {
        setReportLoading(false);
      }
    };
    if (activeTab === 'reports' && !soilReport) {
      loadSoilReport();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'crops', label: 'Crop Recommendation', icon: Sprout },
    { id: 'water', label: 'Water Advice', icon: Droplets },
    { id: 'weather', label: 'Weather Radar', icon: CloudSun },
    { id: 'cost', label: 'Farm Cost & Profit', icon: Calculator },
    { id: 'reports', label: 'Soil Health Card', icon: FileSpreadsheet },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
          AI Agricultural Tools
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-2">
          AgriMind Decision Engine
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Precision calculators and AI recommendations calibrated for your regional Indian agro-climatic zone.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-4 mb-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-agri-600 text-white shadow-lg shadow-agri-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div>
        {/* ===================================================
            TAB 1: CROP RECOMMENDATION
            =================================================== */}
        {activeTab === 'crops' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form Panel */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md h-fit space-y-5">
              {/* Photo Soil Tester Trigger */}
              <div
                onClick={() => setIsSoilScannerOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
                      AI Vision Tool
                    </span>
                  </div>
                  <span className="text-[10px] bg-white text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    Instant Check
                  </span>
                </div>
                <h4 className="text-sm font-black text-white font-display">
                  Scan & Verify Farm Soil by Photo
                </h4>
                <p className="text-[11px] text-emerald-100 leading-tight">
                  Take a photo of your field soil. AI checks if it's valid soil or not soil, and gives exact soil & crop results.
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-200 group-hover:text-white">
                  <span>Open Soil Camera Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h3 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  Manual Soil & Region Parameters
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Select parameters or customize your farm details:
                </p>
              </div>

              <form onSubmit={handleRecommend} className="space-y-4">
                <Select
                  label="State"
                  options={INDIAN_STATES}
                  value={cropForm.state}
                  onChange={(e) => setCropForm({ ...cropForm, state: e.target.value })}
                />

                <Select
                  label="Season"
                  options={SEASONS.map((s) => ({ value: s.id, label: s.name }))}
                  value={cropForm.season}
                  onChange={(e) => setCropForm({ ...cropForm, season: e.target.value })}
                />

                <Select
                  label="Soil Type"
                  options={SOIL_TYPES.map((s) => ({ value: s.id, label: s.name }))}
                  value={cropForm.soilType}
                  onChange={(e) => setCropForm({ ...cropForm, soilType: e.target.value })}
                />

                <Input
                  label="Land Size (Acres)"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={cropForm.landSize}
                  onChange={(e) => setCropForm({ ...cropForm, landSize: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={cropLoading}
                  className="w-full mt-4"
                >
                  Run AI Recommendation
                </Button>
              </form>
            </div>

            {/* Recommendations Output Grid */}
            <div className="lg:col-span-2 space-y-6">
              {cropLoading ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <LoadingSpinner message="Calculating soil nutrient suitability & market demand..." />
                </div>
              ) : cropResults?.recommendations ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        Soil Health Index: {cropResults.soilHealthIndex} / 100 (Optimal)
                      </p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Nitrogen: {cropResults.nitrogenLevel} | Phosphorus: {cropResults.phosphorusLevel} | pH: {cropResults.phValue}
                      </p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  </div>

                  <div className="grid gap-4">
                    {cropResults.recommendations.map((crop, idx) => (
                      <motion.div
                        key={crop.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-bold text-slate-900 font-display">{crop.name}</h4>
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                {crop.suitabilityScore}% Match
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-agri-600">{crop.hindiName}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Est. Net Profit</span>
                            <span className="text-base font-extrabold text-emerald-600 font-display">
                              {crop.estimatedProfit}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs">
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="text-slate-400 block font-semibold">Expected Yield</span>
                            <span className="text-slate-800 font-bold text-sm">{crop.expectedYield}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="text-slate-400 block font-semibold">Duration</span>
                            <span className="text-slate-800 font-bold text-sm">{crop.duration}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="text-slate-400 block font-semibold">Sowing Window</span>
                            <span className="text-slate-800 font-bold text-sm">{crop.sowingTime}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs text-slate-600 space-y-1">
                          <p>
                            <strong className="text-slate-800">Fertilizer Advice:</strong> {crop.fertilizerDosage}
                          </p>
                          <p>
                            <strong className="text-slate-800">Water Need:</strong> {crop.waterRequirement}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ===================================================
            TAB 2: WATER & IRRIGATION ADVICE
            =================================================== */}
        {activeTab === 'water' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md h-fit">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-skyAgri-600" />
                Irrigation Calculator
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Calculate smart water volume based on evapo-transpiration.
              </p>

              <form onSubmit={handleWaterAdvisory} className="space-y-4">
                <Input
                  label="Standing Crop"
                  value={waterForm.crop}
                  onChange={(e) => setWaterForm({ ...waterForm, crop: e.target.value })}
                />

                <Select
                  label="Irrigation System"
                  options={[
                    { value: 'drip', label: 'Drip Irrigation (टपक सिंचाई)' },
                    { value: 'sprinkler', label: 'Sprinkler System (फव्वारा)' },
                    { value: 'flood', label: 'Flood / Furrow (पारंपरिक बहाव)' }
                  ]}
                  value={waterForm.irrigationType}
                  onChange={(e) => setWaterForm({ ...waterForm, irrigationType: e.target.value })}
                />

                <Input
                  label="Plot Area (Acres)"
                  type="number"
                  value={waterForm.landAcres}
                  onChange={(e) => setWaterForm({ ...waterForm, landAcres: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  isLoading={waterLoading}
                  className="w-full mt-4"
                >
                  Generate Schedule
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {waterAdvice && (
                <div className="space-y-6">
                  {/* Highlight Alert */}
                  <div className="bg-gradient-to-r from-skyAgri-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-skyAgri-300">
                          Next Irrigation Recommended
                        </span>
                        <h4 className="text-3xl font-black font-display text-white mt-1">
                          In {waterAdvice.nextIrrigationDueInDays} Days (Optimal Window)
                        </h4>
                        <p className="text-sm text-slate-300 mt-1">
                          Water Volume Needed: ~{waterAdvice.suggestedAmountMm} mm depth
                        </p>
                      </div>

                      <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-center">
                        <p className="text-2xl font-black">{waterAdvice.savingPercentageWithDrip}%</p>
                        <p className="text-[10px] uppercase font-bold tracking-wider">Water Saved</p>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Schedule */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
                    <h4 className="text-lg font-bold text-slate-900 font-display mb-4">
                      Recommended Daily Watering Slots
                    </h4>
                    <div className="grid gap-3">
                      {waterAdvice.schedule?.map((slot, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{slot.time}</p>
                            <p className="text-xs text-slate-500">{slot.reason}</p>
                          </div>
                          <span className="text-xs font-bold text-skyAgri-700 bg-skyAgri-50 px-3 py-1 rounded-lg border border-skyAgri-200">
                            {slot.method}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================
            TAB 3: WEATHER RADAR
            =================================================== */}
        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WeatherWidget />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <h4 className="text-lg font-bold text-slate-900 font-display">
                Monsoon & Spray Windows
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Agricultural radar syncs with IMD (India Meteorological Department) to protect against unexpected hailstorms or washouts.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Fertilizer broadcast is safe today: 15% rain probability.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Thursday evening shows 45% chance of light showers. Hold foliar pesticide.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            TAB 4: FARM COST & PROFIT CALCULATOR
            =================================================== */}
        {activeTab === 'cost' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-agri-600" />
                Input Cost Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Adjust values to calculate net revenue & return on investment.
              </p>

              <form onSubmit={handleCalculateCost} className="space-y-3.5">
                <Input
                  label="Land Area (Acres)"
                  type="number"
                  value={costForm.acres}
                  onChange={(e) => setCostForm({ ...costForm, acres: e.target.value })}
                />
                <Input
                  label="Seeds & Sowing Cost (₹)"
                  type="number"
                  value={costForm.seedCost}
                  onChange={(e) => setCostForm({ ...costForm, seedCost: e.target.value })}
                />
                <Input
                  label="Fertilizers & Pesticides (₹)"
                  type="number"
                  value={costForm.fertilizerCost}
                  onChange={(e) => setCostForm({ ...costForm, fertilizerCost: e.target.value })}
                />
                <Input
                  label="Labor Cost (₹)"
                  type="number"
                  value={costForm.laborCost}
                  onChange={(e) => setCostForm({ ...costForm, laborCost: e.target.value })}
                />
                <Input
                  label="Machinery & Diesel (₹)"
                  type="number"
                  value={costForm.machineryCost}
                  onChange={(e) => setCostForm({ ...costForm, machineryCost: e.target.value })}
                />
                <Input
                  label="Expected Yield (Quintals/Acre)"
                  type="number"
                  value={costForm.yieldPerAcre}
                  onChange={(e) => setCostForm({ ...costForm, yieldPerAcre: e.target.value })}
                />
                <Input
                  label="Mandi Selling Price (₹/Quintal)"
                  type="number"
                  value={costForm.mandiPrice}
                  onChange={(e) => setCostForm({ ...costForm, mandiPrice: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={costLoading}
                  className="w-full mt-4"
                >
                  Recalculate Profit
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {profitReport && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Total Investment Cost
                      </span>
                      <p className="text-2xl font-black text-rose-600 font-display mt-1">
                        {formatCurrency(profitReport.totalCost)}
                      </p>
                      <span className="text-xs text-slate-500">
                        {formatCurrency(profitReport.costPerAcre)} / Acre
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Gross Mandi Revenue
                      </span>
                      <p className="text-2xl font-black text-slate-900 font-display mt-1">
                        {formatCurrency(profitReport.grossRevenue)}
                      </p>
                      <span className="text-xs text-slate-500">
                        {costForm.acres * costForm.yieldPerAcre} Total Quintals
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-agri-600 to-agri-800 text-white p-5 rounded-3xl shadow-xl">
                      <span className="text-xs font-bold text-agri-200 uppercase tracking-wider">
                        Estimated Net Profit
                      </span>
                      <p className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                        {formatCurrency(profitReport.netProfit)}
                      </p>
                      <span className="text-xs font-bold text-sunAmber-300">
                        +{profitReport.roiPercentage}% ROI
                      </span>
                    </div>
                  </div>

                  {/* Expense Breakdown Progress */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 font-display">
                      Expense Percentage Distribution
                    </h4>
                    <div className="space-y-3">
                      {profitReport.breakdown?.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{item.category}</span>
                            <span>{formatCurrency(item.amount)} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-agri-600 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================
            TAB 5: SOIL HEALTH CARD
            =================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {soilReport && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
                {/* Header with Print / Download */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
                      Digital Soil Health Card
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 font-display mt-2">
                      Sample ID: {soilReport.sampleId}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Farmer: {soilReport.farmerName} | Village: {soilReport.village}, {soilReport.district} ({soilReport.state})
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => toast.success('Soil Health Report Card saved to device!')}
                  >
                    Download PDF
                  </Button>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Parameter Tested</th>
                        <th className="pb-3">Soil Test Value</th>
                        <th className="pb-3">Nutrient Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {soilReport.parameters?.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{p.parameter}</td>
                          <td className="py-3 font-bold text-slate-900">{p.value}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                p.color === 'green'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.color === 'yellow'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  p.color === 'green'
                                    ? 'bg-emerald-600'
                                    : p.color === 'yellow'
                                    ? 'bg-amber-600'
                                    : 'bg-rose-600'
                                }`}
                              />
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Soil Health Recommendations */}
                <div className="p-5 rounded-2xl bg-agri-50 border border-agri-200 space-y-2">
                  <h4 className="text-sm font-bold text-agri-900 font-display flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-600" />
                    Agronomist Remedial Recommendations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-agri-800 list-disc list-inside">
                    {soilReport.recommendations?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* AI Soil Scanner & Verification Modal */}
      <SoilScannerModal
        isOpen={isSoilScannerOpen}
        onClose={() => setIsSoilScannerOpen(false)}
      />
    </div>
  );
};

export default FeaturesPage;
