import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, CheckCircle2, Clock, Droplets, Sprout, Filter } from 'lucide-react';
import { farmService } from '../../services/farmService';
import ActivityCard from '../../components/dashboard/ActivityCard';
import Button from '../../components/common/Button';

const FarmerActivitiesPage = () => {
  const [activities, setActivities] = useState([
    {
      id: 'act_1',
      title: 'Morning Drip Irrigation Cycle',
      time: '06:00 AM - 08:30 AM',
      date: 'Today',
      status: 'Completed',
      category: 'Water',
      plot: 'North Plot A (Ponni Paddy)',
      details: 'Applied 1.5 inches of water with root-zone drip drippers.'
    },
    {
      id: 'act_2',
      title: '2nd Top-Dressing Fertilizer Application',
      time: '04:30 PM',
      date: 'Today',
      status: 'Scheduled',
      category: 'Fertilizer',
      plot: 'South Plot B (Wheat)',
      details: 'Apply Urea (25kg/acre) + Micronutrient Zinc Sulfate (5kg/acre).'
    },
    {
      id: 'act_3',
      title: 'Field Weed Inspection & Soil Scuffling',
      time: '07:00 AM',
      date: 'Tomorrow',
      status: 'Pending',
      category: 'Field Care',
      plot: 'East Plot C (Vegetables)',
      details: 'Remove broadleaf weeds and inspect leaf undersides for aphid colonies.'
    },
    {
      id: 'act_4',
      title: 'Scheduled Harvest Window',
      time: 'Morning',
      date: 'In 32 Days',
      status: 'Upcoming',
      category: 'Harvest',
      plot: 'All Cultivated Acreage',
      details: 'Combine harvester booking confirmed with local farmer cooperative.'
    }
  ]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const fetchActivities = async () => {
      try {
        const data = await farmService.getFarmActivities();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setActivities(data);
        }
      } catch (err) {
        // Safe fallback in state
      }
    };
    fetchActivities();
    return () => { isMounted = false; };
  }, []);

  const safeList = Array.isArray(activities) ? activities : [];
  const filtered = filter === 'All' ? safeList : safeList.filter((a) => a.category === filter);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            📅 Farm Operations
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Farm Activities & Daily Task Schedule
          </h2>
          <p className="text-xs text-slate-300">
            Track daily field tasks, irrigation runs, fertilizer schedules, and harvest milestones
          </p>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Water', 'Fertilizer', 'Field Care', 'Harvest'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              filter === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filtered.map((act) => (
          <ActivityCard key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
};

export default FarmerActivitiesPage;
