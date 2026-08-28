from typing import Dict, Any, List
from ..schemas.water import WaterRecommendationRequest, WaterRecommendationResponse, IrrigationStageMilestone

class PrecisionWaterService:
    def calculate_water_needs(self, req: WaterRecommendationRequest) -> Dict[str, Any]:
        crop_lower = req.crop.lower()
        is_paddy = "rice" in crop_lower or "paddy" in crop_lower
        
        # Evapotranspiration (ET0) estimation based on temperature & humidity
        et0_mm = max(3.5, round((req.temperature * 0.15) - (req.humidity * 0.02), 2))
        
        # Crop Coefficient (Kc) by stage
        kc = 1.15 if is_paddy else 0.85
        
        # Daily Water Requirement in Liters per Acre = Area (4046.86 m2) * (ET0 * Kc mm) / 1000 * 1000
        daily_liters_per_acre = int(4046.86 * (et0_mm * kc))
        total_water_liters = daily_liters_per_acre * int(req.farm_size)

        # Rain Hold Logic
        if req.forecast_rain_chance >= 45 or req.rainfall >= 15:
            irrigation_suggestion = "Hold irrigation — Rain predicted in next 24-48 hours. Conserve groundwater."
            frequency = "Pause until rain clears; resume after 3 days"
            rain_rec = f"{req.forecast_rain_chance}% rain forecast will replenish root zone naturally."
        else:
            irrigation_suggestion = "Apply scheduled irrigation tomorrow early morning (06:00 AM - 08:30 AM)."
            frequency = "Once every 3 days (AWD cycle)" if is_paddy else "Daily drip run (1h 45m)"
            rain_rec = "Clear skies expected. Full irrigation run advised."

        water_savings = [
            "Early morning irrigation prevents 28% evaporative loss compared to afternoon watering.",
            "Maintain 2-inch field bund height to capture incoming seasonal rainwater.",
            "Use alternate wetting and drying (AWD) field pipes to monitor root water levels without flooding."
        ]

        milestones = [
            IrrigationStageMilestone(
                stage_name="Crown Root Initiation (CRI) / Early Vegetative",
                status="Completed",
                recommended_depth="2.5 inches (60mm)",
                timing="Days 15 - 25"
            ),
            IrrigationStageMilestone(
                stage_name="Active Tillering & Stem Elongation",
                status="Active Current",
                recommended_depth="2.0 inches (50mm)",
                timing="Scheduled Tomorrow 06:30 AM"
            ),
            IrrigationStageMilestone(
                stage_name="Panicle Initiation & Heading",
                status="Upcoming",
                recommended_depth="2.5 inches (65mm)",
                timing="In 20 Days"
            ),
            IrrigationStageMilestone(
                stage_name="Grain Milking & Dough Stage",
                status="Upcoming",
                recommended_depth="1.5 inches (40mm)",
                timing="In 40 Days"
            )
        ]

        return {
            "crop": req.crop,
            "farm_size_acres": req.farm_size,
            "estimated_water_requirement_liters": total_water_liters,
            "irrigation_suggestion": irrigation_suggestion,
            "irrigation_frequency": frequency,
            "rain_based_recommendation": rain_rec,
            "water_saving_suggestions": water_savings,
            "critical_growth_milestones": milestones
        }

water_service = PrecisionWaterService()
