import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { farmService } from '../../services/farmService';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../hooks/useAuth';

const FarmerCostPage = () => {
  const { user } = useAuth();
  const [costData, setCostData] = useState({
    totalCost: 118500,
    expectedRevenue: 357000,
    estimatedProfit: 238500,
    roiPercentage: '201%',
    breakdown: [
      { item: 'Certified Seeds & Nursery Prep', amount: 12000, percentage: 10 },
      { item: 'NPK Fertilizers & Micronutrients', amount: 28500, percentage: 24 },
      { item: 'Transplanting, Weeding & Field Labor', amount: 42000, percentage: 35 },
      { item: 'Tractor Tillage & Harvester Machinery', amount: 36000, percentage: 31 }
    ]
  });

  useEffect(() => {
    const loadCost = async () => {
      const data = await farmService.getFarmCostData();
      if (data) {
        setCostData({
          totalCost: data.totalCost || 118500,
          expectedRevenue: data.expectedRevenue || 357000,
          estimatedProfit: data.estimatedProfit || 238500,
          roiPercentage: data.roiPercentage || data.roi || '201%',
          breakdown: data.breakdown || []
        });
      }
    };
    loadCost();
  }, []);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            💰 Farm Profit & ROI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Farm Expense & Revenue Calculator
          </h2>
          <p className="text-xs text-slate-300">
            Real-time input costs, estimated harvest value and net farmer earnings
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Input Expenses"
          value={`₹${costData.totalCost.toLocaleString()}`}
          subtitle="Seeds, fertilizer, labor & diesel"
          icon={Calculator}
          color="rose"
        />
        <StatCard
          title="Gross Expected Harvest"
          value={`₹${costData.expectedRevenue.toLocaleString()}`}
          subtitle="140 Quintals @ ₹2,550/Qtl"
          icon={TrendingUp}
          color="sky"
        />
        <StatCard
          title="Estimated Net Profit"
          value={`₹${costData.estimatedProfit.toLocaleString()}`}
          subtitle={`${costData.roiPercentage} Return on Investment (ROI)`}
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Expense Itemized Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-600" />
          <span>Detailed Input Cost Breakdown (Current Season)</span>
        </h3>

        <div className="space-y-3">
          {costData.breakdown.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.item}</h4>
                  <p className="text-slate-500">{item.percentage}% of overall farm expenditure</p>
                </div>
              </div>

              <span className="text-sm font-black text-slate-900 sm:text-right">
                ₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerCostPage;
