import os
import joblib
import numpy as np
from typing import Dict, List, Any

# Agronomic knowledge repository for detailed crop profiling
CROP_AGRONOMIC_PROFILES: Dict[str, Dict[str, str]] = {
    "rice": {
        "title": "Paddy / Rice (Ponni Samba / BPT-5204)",
        "expected_yield": "24 - 28 Quintals / Acre",
        "optimal_sowing_window": "Kharif / Samba (July - August) or Thaladi (Oct - Nov)",
        "fertilizer_plan": "Urea: 60kg + DAP: 45kg + MOP (Potash): 25kg + Zinc Sulfate: 5kg/Acre",
        "water_requirement": "High (Alternate Wetting & Drying recommended for 30% water saving)",
        "market_outlook": "₹2,450 - ₹2,600 / Quintal at local APMC Mandis"
    },
    "wheat": {
        "title": "High Yield Wheat (HD 3086 / GW 322)",
        "expected_yield": "20 - 24 Quintals / Acre",
        "optimal_sowing_window": "Rabi (November - December)",
        "fertilizer_plan": "Urea: 55kg + DAP: 40kg + MOP: 20kg/Acre in 3 split doses",
        "water_requirement": "Moderate (4-5 critical irrigations at CRI, tillering, heading)",
        "market_outlook": "₹2,275 (MSP benchmark) - ₹2,450 / Quintal"
    },
    "maize": {
        "title": "Hybrid Maize / Corn (NK 6240 / Pioneer 30V92)",
        "expected_yield": "30 - 36 Quintals / Acre",
        "optimal_sowing_window": "Kharif (June - July) or Rabi (October - November)",
        "fertilizer_plan": "Urea: 65kg + DAP: 40kg + Potash: 30kg + Zinc: 5kg/Acre",
        "water_requirement": "Moderate (Requires well-drained soil; sensitive to waterlogging)",
        "market_outlook": "₹2,100 - ₹2,280 / Quintal (Strong poultry feed demand)"
    },
    "cotton": {
        "title": "Bt Cotton (Long Staple RCH 659 / Mallika)",
        "expected_yield": "14 - 18 Quintals / Acre",
        "optimal_sowing_window": "Kharif (May - July)",
        "fertilizer_plan": "Urea: 70kg + DAP: 50kg + Potash: 30kg + Boron: 1kg/Acre",
        "water_requirement": "Moderate (Deep root penetration in Black Regur soil)",
        "market_outlook": "₹6,800 - ₹7,400 / Quintal at spinning mill yards"
    },
    "groundnut": {
        "title": "Groundnut / Peanut (TMV 13 / Kadiri 6 / Dharani)",
        "expected_yield": "16 - 20 Quintals / Acre",
        "optimal_sowing_window": "Kharif (June - July) or Rabi Post-Rice (Jan - Feb)",
        "fertilizer_plan": "Gypsum: 200kg + DAP: 30kg + Potash: 30kg/Acre",
        "water_requirement": "Low to Moderate (Critical at pegging and pod formation)",
        "market_outlook": "₹6,200 - ₹6,850 / Quintal"
    },
    "turmeric": {
        "title": "High Curcumin Turmeric (Erode Local / Salem BSR-2)",
        "expected_yield": "25 - 30 Quintals (Cured) / Acre",
        "optimal_sowing_window": "May - June (Pre-Monsoon)",
        "fertilizer_plan": "FYM Compost: 10 Tons + DAP: 50kg + MOP: 60kg + Neem Cake: 100kg/Acre",
        "water_requirement": "High (Requires regular moisture without root stagnation)",
        "market_outlook": "₹12,000 - ₹14,500 / Quintal at Erode / Nizamabad spice hubs"
    },
    "sugarcane": {
        "title": "Sugarcane (Co 0238 / Co 86032)",
        "expected_yield": "45 - 55 Tons / Acre",
        "optimal_sowing_window": "Spring (Feb - March) or Autumn (Oct - Nov)",
        "fertilizer_plan": "Urea: 120kg + DAP: 75kg + Potash: 60kg/Acre in split doses",
        "water_requirement": "High (Subsurface Drip Irrigation recommended)",
        "market_outlook": "₹3,400 / Ton (FRP statutory mill price)"
    },
    "chickpea": {
        "title": "Chickpea / Bengal Gram (JG 11 / JAKI 9218)",
        "expected_yield": "8 - 12 Quintals / Acre",
        "optimal_sowing_window": "Rabi (October - November)",
        "fertilizer_plan": "DAP: 35kg + Rhizobium & PSB seed treatment",
        "water_requirement": "Low (Thrives on residual soil moisture)",
        "market_outlook": "₹5,400 - ₹5,850 / Quintal"
    },
    "jowar": {
        "title": "Sorghum / Jowar (CSH 16 / Maldandi)",
        "expected_yield": "14 - 18 Quintals / Acre",
        "optimal_sowing_window": "Kharif (June - July) or Rabi (Sept - Oct)",
        "fertilizer_plan": "Urea: 40kg + DAP: 30kg + Potash: 15kg/Acre",
        "water_requirement": "Low (Highly drought tolerant dryland crop)",
        "market_outlook": "₹3,180 (MSP) / Quintal"
    },
    "coffee": {
        "title": "Arabica / Robusta Coffee",
        "expected_yield": "800 - 1200 kg / Acre (Parchment)",
        "optimal_sowing_window": "Planting: July - August (Monsoon)",
        "fertilizer_plan": "NPK 17:17:17 + Dolomite + Zinc/Magnesium foliar spray",
        "water_requirement": "High (Requires 1500mm+ rainfall and canopy shade)",
        "market_outlook": "₹18,000 - ₹22,000 / 50kg bag at Coffee Board auctions"
    }
}

class CropMLService:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.models_dir = os.path.join(base_dir, "../../ml/saved_models")
        
        self.model = None
        self.scaler = None
        self.encoder = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            model_path = os.path.join(self.models_dir, "crop_recommendation_model.joblib")
            scaler_path = os.path.join(self.models_dir, "scaler.joblib")
            encoder_path = os.path.join(self.models_dir, "label_encoder.joblib")

            if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(encoder_path):
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                self.encoder = joblib.load(encoder_path)
                print("[AGRIMIND ML Service] Real Scikit-Learn Model Artifacts Loaded Successfully.")
            else:
                print("[AGRIMIND ML Service] Model artifacts not found. Run train_model.py first.")
        except Exception as e:
            print(f"[AGRIMIND ML Service] Error loading model artifacts: {e}")

    def predict(self, n: float, p: float, k: float, temp: float, hum: float, ph: float, rain: float) -> Dict[str, Any]:
        """
        Executes real Scikit-learn inference with probabilities across all crops.
        """
        if self.model is None or self.scaler is None or self.encoder is None:
            self._load_artifacts()

        # Feature Vector: [N, P, K, temperature, humidity, ph, rainfall]
        features = np.array([[n, p, k, temp, hum, ph, rain]])
        scaled_features = self.scaler.transform(features)

        # 1. Primary Prediction
        pred_idx = self.model.predict(scaled_features)[0]
        predicted_crop_name = self.encoder.inverse_transform([pred_idx])[0]

        # 2. Probability Distribution for all classes
        probabilities = self.model.predict_proba(scaled_features)[0]
        classes = self.encoder.classes_

        # Sort recommendations by highest probability
        ranked_indices = np.argsort(probabilities)[::-1]

        recommendations: List[Dict[str, Any]] = []
        for idx in ranked_indices:
            crop_key = classes[idx].lower()
            conf = float(probabilities[idx])
            
            # Include top crops with significant probability
            if conf >= 0.05 or len(recommendations) < 3:
                profile = CROP_AGRONOMIC_PROFILES.get(crop_key, {
                    "title": crop_key.capitalize(),
                    "expected_yield": "20 - 25 Quintals / Acre",
                    "optimal_sowing_window": "Seasonal (Kharif / Rabi)",
                    "fertilizer_plan": "Standard NPK Balanced Application",
                    "water_requirement": "Moderate",
                    "market_outlook": "Steady APMC Mandi Demand"
                })

                recommendations.append({
                    "crop": profile["title"],
                    "confidence": round(conf * 100, 1),
                    "expected_yield": profile["expected_yield"],
                    "optimal_sowing_window": profile["optimal_sowing_window"],
                    "fertilizer_plan": profile["fertilizer_plan"],
                    "water_requirement": profile["water_requirement"],
                    "market_outlook": profile["market_outlook"]
                })

        top_confidence = float(probabilities[pred_idx])

        return {
            "predicted_crop": CROP_AGRONOMIC_PROFILES.get(predicted_crop_name.lower(), {}).get("title", predicted_crop_name.capitalize()),
            "confidence_score": round(top_confidence * 100, 1),
            "all_recommendations": recommendations[:3] # Top 3 ranked crops
        }

ml_service = CropMLService()
