import React from 'react';
import { BarChart3, TrendingUp, Award, FileText, CheckCircle2 } from 'lucide-react';
import { farmService } from '../../services/farmService';
import StatCard from '../../components/dashboard/StatCard';

const FarmerReportsPage = () => {
  const reports = farmService.getFarmReports();

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-teal-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            📊 Farm Performance Logs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Historical Harvests & Soil Scorecards
          </h2>
          <p className="text-xs text-slate-300">
            Verified yield analytics and multi-season performance records
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Soil Health Score"
          value={`${reports.soilHealthScore}/100`}
          subtitle="Optimal NPK Balance"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Crop Health Index"
          value="98%"
          subtitle="0 Pests / Blight Free"
          icon={CheckCircle2}
          color="sky"
        />
        <StatCard
          title="Water Saved"
          value="48k L"
          subtitle="Via Drip Optimization"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Avg. Seasonal ROI"
          value={reports.roiPercentage}
          subtitle="Top 5% in District"
          icon={BarChart3}
          color="amber"
        />
      </div>

      {/* Past Harvests Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          <span>Past Seasons Yield & Selling Records</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-black uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Season & Year</th>
                <th className="p-3.5">Harvested Crop</th>
                <th className="p-3.5">Total Yield</th>
                <th className="p-3.5">Buyer / Merchant Sold To</th>
                <th className="p-3.5 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.pastHarvests.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{h.year}</td>
                  <td className="p-3.5 font-black text-emerald-700">{h.crop}</td>
                  <td className="p-3.5">{h.yield}</td>
                  <td className="p-3.5 text-slate-600">{h.soldTo}</td>
                  <td className="p-3.5 font-black text-emerald-700 text-right">{h.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerReportsPage;
