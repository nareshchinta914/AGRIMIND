import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_ai_service_tests():
    print("[AGRIMIND AI] Running AI Service & ML Pipeline Integration Tests...\n")
    passed = 0
    failed = 0

    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        assert r.status_code == 200
        print("[PASS] Test 1: GET /health —", r.json()["service"])
        passed += 1
    except Exception as e:
        print("[FAIL] Test 1: GET /health —", str(e))
        failed += 1

    # 2. Crop Prediction ML
    try:
        payload = {
            "nitrogen": 85.0,
            "phosphorus": 55.0,
            "potassium": 40.0,
            "ph": 6.8,
            "temperature": 23.5,
            "humidity": 82.0,
            "rainfall": 210.0,
            "soil_type": "alluvial",
            "season": "kharif"
        }
        r = requests.post(f"{BASE_URL}/predict/crop", json=payload)
        assert r.status_code == 200
        data = r.json()
        print(f"[PASS] Test 2: POST /predict/crop — Predicted: {data['predicted_crop']} ({data['confidence_score']}%)")
        passed += 1
    except Exception as e:
        print("[FAIL] Test 2: POST /predict/crop —", str(e))
        failed += 1

    # 3. Multilingual Kisan AI Assistant Chat (Tamil)
    try:
        payload = {
            "message": "என் பயிரில் இலைகள் மஞ்சளாக உள்ளது, என்ன உரம் இட வேண்டும்?",
            "language": "ta",
            "farmer_context": {
                "location": "Thanjavur, Tamil Nadu",
                "current_crop": "Ponni Samba Paddy",
                "soil_type": "Alluvial Loam",
                "farm_size": 5.0,
                "weather_summary": "31°C, Clear"
            }
        }
        r = requests.post(f"{BASE_URL}/assistant/chat", json=payload)
        assert r.status_code == 200
        data = r.json()
        print("[PASS] Test 3: POST /assistant/chat (Tamil) — Contextual Reply Generated. Actions:", data["suggested_actions"])
        passed += 1
    except Exception as e:
        print("[FAIL] Test 3: POST /assistant/chat —", str(e))
        failed += 1

    # 4. Precision Water Recommendation
    try:
        payload = {
            "crop": "Paddy",
            "farm_size": 5.0,
            "soil": "alluvial",
            "growth_stage": "Tillering & Booting",
            "temperature": 32.0,
            "humidity": 65.0,
            "rainfall": 0.0,
            "forecast_rain_chance": 10.0
        }
        r = requests.post(f"{BASE_URL}/water/recommendation", json=payload)
        assert r.status_code == 200
        data = r.json()
        print(f"[PASS] Test 4: POST /water/recommendation — {data['estimated_water_requirement_liters']} Liters/day | Suggestion: {data['irrigation_suggestion']}")
        passed += 1
    except Exception as e:
        print("[FAIL] Test 4: POST /water/recommendation —", str(e))
        failed += 1

    print("\n==============================================")
    print(f"🏁 AI Service Tests Completed: {passed} Passed, {failed} Failed")
    print("==============================================\n")

if __name__ == "__main__":
    run_ai_service_tests()
