import React, { useState } from 'react';
import { Sprout, Camera, Sparkles, TrendingUp, Droplets, CheckCircle2 } from 'lucide-react';
import SoilScannerModal from '../../components/soil/SoilScannerModal';
import CropCameraModal from '../../components/camera/CropCameraModal';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const FarmerCropsPage = () => {
  const { user } = useAuth();
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);

  const recommendedVarieties = [
    {
      crop: 'Paddy / Rice (Ponni Samba)',
      suitability: '98% Optimal Match',
      variety: 'BPT-5204 / CR 1009 Sub 1',
      sowingSeason: 'July - August (Kharif / Samba)',
      duration: '135 - 145 Days',
      expectedYield: '24 - 28 Quintals/Acre',
      fertilizerRecipe: 'Urea: 60kg + DAP: 45kg + MOP: 25kg + Zinc: 5kg/Acre',
      irrigationNeed: 'High (Alternate Wetting & Drying recommended)',
      marketValue: '₹2,450 - ₹2,580 / Quintal'
    },
    {
      crop: 'Hybrid Maize / Corn',
      suitability: '94% High Match',
      variety: 'NK 6240 / Pioneer 30V92',
      sowingSeason: 'October - November (Rabi) or June',
      duration: '105 - 115 Days',
      expectedYield: '30 - 36 Quintals/Acre',
      fertilizerRecipe: 'Urea: 65kg + DAP: 40kg + Potash: 30kg + Zinc: 5kg/Acre',
      irrigationNeed: 'Moderate (5 critical stage waterings)',
      marketValue: '₹2,100 - ₹2,250 / Quintal'
    },
    {
      crop: 'Organic Black Gram / Urad Dal',
      suitability: '92% High Match',
      variety: 'VBN 6 / VBN 8 / MDU 1',
      sowingSeason: 'Post-Paddy Residual Moisture (Jan - Feb)',
      duration: '65 - 70 Days',
      expectedYield: '6 - 8 Quintals/Acre',
      fertilizerRecipe: 'DAP: 25kg + Rhizobium seed inoculant',
      irrigationNeed: 'Low (1 to 2 light waterings)',
      marketValue: '₹7,500 - ₹8,200 / Quintal'
    }
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            AI Crop Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Crop Recommendation & Disease Diagnosis
          </h2>
          <p className="text-xs text-slate-300">
            Soil: <strong>{user?.soilType ? user.soilType.toUpperCase() : 'ALLUVIAL'}</strong> • District: <strong>{user?.district || 'Thanjavur'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={Camera}
            onClick={() => setIsSoilModalOpen(true)}
            className="shadow-lg shadow-emerald-600/30"
          >
            Scan Soil
          </Button>
          <Button
            variant="amber"
            size="md"
            icon={Sparkles}
            onClick={() => setIsDiseaseModalOpen(true)}
          >
            Leaf Disease Scanner
          </Button>
        </div>
      </div>

      {/* Recommended Crop Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Top Recommended High-Yield Crops for Your Soil</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedVarieties.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {item.suitability}
                  </span>
                  <span className="text-xs font-black text-slate-900">{item.marketValue}</span>
                </div>

                <h4 className="text-base font-black text-slate-900 font-display">{item.crop}</h4>
                <p className="text-xs text-slate-500 font-medium">Variety: {item.variety}</p>

                <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-700">
                  <div><strong>Sowing:</strong> {item.sowingSeason}</div>
                  <div><strong>Expected Yield:</strong> {item.expectedYield}</div>
                  <div><strong>Duration:</strong> {item.duration}</div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 mt-2">
                    <strong>Fertilizer Dosage:</strong> {item.fertilizerRecipe}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-sky-700 font-bold">
                <Droplets className="w-3.5 h-3.5" />
                <span>{item.irrigationNeed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SoilScannerModal isOpen={isSoilModalOpen} onClose={() => setIsSoilModalOpen(false)} />
      <CropCameraModal isOpen={isDiseaseModalOpen} onClose={() => setIsDiseaseModalOpen(false)} />
    </div>
  );
};

export default FarmerCropsPage;
