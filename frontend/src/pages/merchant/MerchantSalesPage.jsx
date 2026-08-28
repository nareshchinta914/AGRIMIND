import React from 'react';
import { TrendingUp, DollarSign, BarChart3, Users, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const MerchantSalesPage = () => {
  const salesHistory = [
    { date: 'Today', commodity: 'Basmati Steam Rice (1121)', volume: '250 Bags (6.25 Tons)', amount: '₹4,62,500', buyer: 'Metro Food Wholesalers' },
    { date: 'Yesterday', commodity: 'Organic Ponni Paddy (Milled)', volume: '180 Bags (13.5 Tons)', amount: '₹4,41,000', buyer: 'Chennai Organic Mart' },
    { date: '24 Aug 2026', commodity: 'Bt Cotton Long Staple', volume: '40 Quintals', amount: '₹2,82,000', buyer: 'Tirupur Spinning Mills' },
    { date: '21 Aug 2026', commodity: 'Erode High Curcumin Turmeric', volume: '60 Bags', amount: '₹4,08,000', buyer: 'Kerala Spices Exporters' }
  ];

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            📊 Sales & Revenue Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Sales Turnover & Farmer Sourcing Ledger
          </h2>
          <p className="text-xs text-slate-300">
            Real-time procurement volume, gross trade sales, and milling margins
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Sourcing Sales"
          value="₹18,45,000"
          subtitle="42.5 Tons grain procured"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Gross Trading Margin"
          value="₹4,20,000"
          subtitle="22.8% Average margin"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          title="Direct Sourced Farmers"
          value="128"
          subtitle="Zero APMC middleman dispute"
          icon={Users}
          color="sky"
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-600" />
          <span>Recent Commodity Dispatches & Sales Transactions</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-black uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Commodity / Produce</th>
                <th className="p-3.5">Volume Dispatched</th>
                <th className="p-3.5">Buyer / Entity</th>
                <th className="p-3.5 text-right">Invoice Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesHistory.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{s.date}</td>
                  <td className="p-3.5 font-black text-amber-900">{s.commodity}</td>
                  <td className="p-3.5">{s.volume}</td>
                  <td className="p-3.5 text-slate-600">{s.buyer}</td>
                  <td className="p-3.5 font-black text-slate-900 text-right">{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MerchantSalesPage;
