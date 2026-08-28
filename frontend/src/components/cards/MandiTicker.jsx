import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Salad } from 'lucide-react';
import { marketService } from '../../services/marketService';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const MandiTicker = () => {
  const [mandiData, setMandiData] = useState({ prices: [], lastUpdated: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await marketService.getMandiPrices();
        setMandiData(data);
      } catch (err) {
        console.error('Error loading mandi prices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  if (loading || !mandiData.prices?.length) return null;

  return (
    <div className="w-full bg-slate-900 text-white py-3 border-y border-emerald-950 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-3">
        {/* Fixed Title Badge */}
        <div className="flex items-center gap-2 flex-shrink-0 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-display">
            Live Mandi & Vegetable Rates
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            ({mandiData.lastUpdated || 'Today'})
          </span>
        </div>

        {/* Scrolling Commodity & Vegetable Cards */}
        <div className="flex-1 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-3 min-w-max">
            {mandiData.prices.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{item.category === 'Vegetables' ? '🥦' : item.category === 'Spices & Condiments' ? '🌶️' : '🌾'}</span>
                    <p className="text-xs font-bold text-slate-200 truncate max-w-[130px]">{item.commodity.split('(')[0].trim()}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.market.split(',')[0]}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-white">
                    {formatCurrency(item.modalPrice)} <span className="text-[9px] font-normal text-slate-400">/Qtl</span>
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    ₹{(item.pricePerKg || item.modalPrice / 100).toFixed(0)}/kg
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.trend === 'up'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <Link
          to="/marketplace"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold transition-colors flex-shrink-0 border border-emerald-500/30"
        >
          <span>All 18+ Vegetables & Mandis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default MandiTicker;
