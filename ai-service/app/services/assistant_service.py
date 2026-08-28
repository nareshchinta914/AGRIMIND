from typing import Dict, Any, List
from ..schemas.chat import FarmerContext

class AssistantService:
    """
    Contextual Multilingual Agricultural Advisory Engine
    """
    def answer_query(self, message: str, language: str, context: FarmerContext) -> Dict[str, Any]:
        msg_lower = message.lower()
        lang = language.lower()

        # Context Variables
        crop = context.current_crop or "Paddy (Ponni Samba)"
        loc = context.location or "Thanjavur"
        soil = context.soil_type or "Alluvial Soil"
        farm_size = context.farm_size or 5.0
        weather = context.weather_summary or "31°C, Partly Cloudy"

        # 1. QUESTION: YELLOW LEAVES / DISEASE DIAGNOSIS
        if any(w in msg_lower for w in ["yellow", "மஞ்சள்", "పసుపు", "पीली", "हळदी", "হলুদ", "leaves", "இலை"]):
            if lang == "ta":
                reply = (
                    f"உங்கள் {loc} நிலத்தில் {crop} பயிரில் இலைகள் மஞ்சளாவதற்கு முக்கிய காரணங்கள்:\n\n"
                    "1. **நைட்ரஜன் பற்றாக்குறை**: கீழ் இலைகள் முதலில் மஞ்சளானால் யூரியா அல்லது வேப்பம் புண்ணாக்கு உரம் இடவும்.\n"
                    "2. **இரும்பு/துத்தநாக சத்து குறைபாடு**: மேல் தளிர்கள் மஞ்சளானால் 0.5% ஜிங்க் சல்பேட் அல்லது ஃபெரஸ் சல்பேட் கரைசல் தெளிக்கவும்.\n"
                    "3. **வேர் அழுகல் / அதிக நீர்**: வயலில் நீர் தேங்காமல் வடிகால் அமைக்கவும்."
                )
            elif lang == "te":
                reply = (
                    f"మీ {loc} పొలంలోని {crop} పంటలో ఆకులు పసుపు రంగులోకి మారడానికి కారణాలు:\n\n"
                    "1. **నత్రజని లోపం**: క్రింది ఆకులు పసుపుగా మారితే యూరియా వేయండి.\n"
                    "2. **జింక్ లోపం**: పై ఆకులు పసుపుగా మారితే 0.5% జింక్ సల్ఫేట్ పిచికారీ చేయండి.\n"
                    "3. **అధిక తేమ**: పొలంలో నీరు నిల్వ ఉండకుండా చూసుకోండి."
                )
            elif lang == "hi":
                reply = (
                    f"आपके {loc} खेत में {crop} की पत्तियों का पीला होना:\n\n"
                    "1. **नाइट्रोजन की कमी**: निचली पत्तियां पीली होने पर यूरिया (25-30 किग्रा/एकड़) का छिड़काव करें।\n"
                    "2. **जिंक/आयरन की कमी**: ऊपरी नई पत्तियां पीली होने पर 0.5% जिंक सल्फेट घोल का छिड़काव करें।\n"
                    "3. **जलभराव**: खेत से अतिरिक्त पानी निकालने की व्यवस्था करें।"
                )
            else:
                reply = (
                    f"For {crop} in {loc} ({soil}), yellowing leaves usually indicate:\n\n"
                    "1. **Nitrogen Deficiency**: Bottom leaves turn yellow from tip -> Apply top-dressing Urea (25kg/acre).\n"
                    "2. **Zinc / Micronutrient Deficiency**: Top young leaves turn pale yellow -> Foliar spray 0.5% Zinc Sulfate + Lime.\n"
                    "3. **Waterlogged Roots**: Ensure field drainage to restore oxygen to root zones."
                )

            actions = ["View Fertilizer Dosage", "Schedule Micronutrient Spray", "Scan Leaf Photo"]

        # 2. QUESTION: WATERING / IRRIGATION
        elif any(w in msg_lower for w in ["water", "irrigate", "தண்ணீர்", "నీరు", "पानी", "నీళ్ళు", "irrigation"]):
            if lang == "ta":
                reply = (
                    f"உங்கள் {farm_size} ஏக்கர் {crop} பயிருக்கு தற்போதைய பாசன ஆலோசனை:\n\n"
                    "• **பாசன நேரம்**: நாளை காலை 06:30 மணிக்கு நீர் பாய்ச்சவும்.\n"
                    "• **முறை**: காய்ச்சலும் பாய்ச்சலுமாக (AWD) நீர் மேலாண்மை செய்வதன் மூலம் 30% நீரை மிச்சப்படுத்தலாம்.\n"
                    f"• **வானிலை**: {weather}. அதிகாலை பாசனம் நீர் ஆவியாவதைத் தடுக்கும்."
                )
            elif lang == "te":
                reply = (
                    f"మీ {farm_size} ఎకరాల {crop} పంటకు నీటి యాజమాన్య సూచన:\n\n"
                    "• **నీటి సమయం**: రేపు ఉదయం 06:30 గంటలకు నీరు పెట్టండి.\n"
                    "• **పద్ధతి**: బిందు సేద్యం లేదా ఆరబెట్టి తడిపే విధానం పాటించండి.\n"
                    f"• **వాతావరణం**: {weather}."
                )
            elif lang == "hi":
                reply = (
                    f"आपके {farm_size} एकड़ {crop} के लिए सिंचाई सलाह:\n\n"
                    "• **सिंचाई का समय**: कल सुबह 06:30 बजे सिंचाई करें।\n"
                    "• **सिंचाई विधि**: टपक सिंचाई (Drip) या अल्टरनेट वेटिंग एंड ड्राइंग से 30% पानी की बचत होगी।\n"
                    f"• **मौसम स्थिति**: {weather}।"
                )
            else:
                reply = (
                    f"Irrigation schedule for {farm_size} acres of {crop} on {soil}:\n\n"
                    "• **Next Watering**: Tomorrow at 06:30 AM (2h 15m duration).\n"
                    "• **Method**: Alternate Wetting & Drying (AWD) saves 30% water while boosting root aeration.\n"
                    f"• **Weather Conditions**: {weather}."
                )

            actions = ["Open Water Schedule", "Set Irrigation Alarm", "Check Soil Moisture"]

        # 3. QUESTION: REDUCE FERTILIZER COST
        elif any(w in msg_lower for w in ["fertilizer", "cost", "உரம்", "ఖర్చు", "उर्वरक", "खाद", "விலை", "డబ్బు"]):
            if lang == "ta":
                reply = (
                    f"{crop} பயிரில் உரச் செலவை 40% குறைக்க வழிமுறைகள்:\n\n"
                    "1. **வேப்பம்பூசிய யூரியா & நானோ யூரியா**: 1 பாட்டில் நானோ யூரியா ஒரு மூட்டை யூரியாவுக்கு சமம்.\n"
                    "2. **மண்புழு உரம் & அசோஸ்பைரில்லம்**: நுண்ணுயிர் உரங்கள் நிலத்தின் ஊட்டச்சத்தை இயற்கையாக அதிகரிக்கும்.\n"
                    "3. **மண் பரிசோதனை**: உங்கள் மண் பரிசோதனை அறிக்கையின்படி மட்டுமே குறிப்பிட்ட சத்துக்களை இடவும்."
                )
            elif lang == "te":
                reply = (
                    f"{crop} పంటలో ఎరువుల ఖర్చును 40% తగ్గించే మార్గాలు:\n\n"
                    "1. **నానో యూరియా & నానో డిఎపి**: రసాయన ఎరువుల ఖర్చును తగ్గిస్తుంది.\n"
                    "2. **సేంద్రియ ఎరువులు & జీవామృతం**: నేల సారాన్ని పెంచుతాయి.\n"
                    "3. **నేల పరీక్ష ఆధారిత వాడకం**: అవసరమైన మోతాదులోనే ఎరువులు వాడండి."
                )
            elif lang == "hi":
                reply = (
                    f"{crop} की खेती में खाद का खर्च 40% कम करने के उपाय:\n\n"
                    "1. **नैनो यूरिया और नैनो डीएपी**: एक बोतल नैनो यूरिया एक बोरी यूरिया के बराबर काम करता है।\n"
                    "2. **जैविक खाद एवं जीवामृत**: मिट्टी की उर्वरता प्राकृतिक रूप से बढ़ाते हैं।\n"
                    "3. **मृदा स्वास्थ्य कार्ड**: मिट्टी की जांच अनुसार ही संतुलित खाद डालें।"
                )
            else:
                reply = (
                    f"To optimize fertilizer expenses for {crop} ({soil}):\n\n"
                    "1. **Switch to IFFCO Nano Urea / Nano DAP**: Cuts chemical input costs by 45%.\n"
                    "2. **Biofertilizers (Azospirillum / Phosphobacteria)**: Inoculate seeds to fix atmospheric nitrogen for ₹150/acre.\n"
                    "3. **Soil-Test Based Application**: Only apply deficient nutrients rather than blanket NPK broadcasting."
                )

            actions = ["Calculate Input Cost", "View Organic Recipes", "Soil Health Scorecard"]

        # 4. QUESTION: WHAT CROP TO GROW / RECOMMENDATIONS
        elif any(w in msg_lower for w in ["grow", "crop", "பயிர்", "పంట", "फसल", "recommend", "seed"]):
            if lang == "ta":
                reply = (
                    f"உங்கள் {loc} பகுதியின் {soil} நிலத்திற்கு சிறந்த பயிர்கள்:\n\n"
                    "1. **பொன்னி சம்பா நெல் (BPT-5204)**: ஏக்கருக்கு 26-28 குவிண்டால் மகசூல், சிறந்த சந்தை விலை.\n"
                    "2. **ஹைப்ரிட் மக்காச்சோளம்**: ஏக்கருக்கு 32-35 குவிண்டால் மகசூல் (குறைந்த பாசனத் தேவை).\n"
                    "3. **உளுந்து (VBN 8)**: நெல் அறுவடைக்கு பின் கூடுதல் வருமானம் தரக்கூடியது."
                )
            elif lang == "te":
                reply = (
                    f"మీ {loc} ప్రాంతంలోని {soil} నేలకు అనువైన పంటలు:\n\n"
                    "1. **వరి (బిపిటి-5204)**: ఎకరానికి 25-28 క్వింటాళ్ల దిగుబడి.\n"
                    "2. **హైబ్రిడ్ మొక్కజొన్న**: ఎకరానికి 30-35 క్వింటాళ్ల దిగుబడి.\n"
                    "3. **మినుములు (VBN 8)**: తక్కువ నీటితో అధిక లాభం."
                )
            elif lang == "hi":
                reply = (
                    f"आपके {loc} क्षेत्र की {soil} मिट्टी के लिए सबसे उपयुक्त फसलें:\n\n"
                    "1. **धान / चावल (बीपीटी-5204)**: 25-28 क्विंटल/एकड़ पैदावार।\n"
                    "2. **संकर मक्का**: 30-35 क्विंटल/एकड़ पैदावार।\n"
                    "3. **उड़द / दलहन**: कम पानी में उच्च लाभ देने वाली फसल।"
                )
            else:
                reply = (
                    f"Top recommended high-yield crops for {soil} in {loc}:\n\n"
                    "1. **Paddy / Rice (Ponni Samba / BPT-5204)**: 24 - 28 Qtl/Acre yield with premium mandi rates.\n"
                    "2. **Hybrid Maize (Pioneer 30V92)**: 30 - 36 Qtl/Acre yield with low water demand.\n"
                    "3. **Black Gram / Pulses**: Excellent post-harvest rotational crop to enrich soil nitrogen."
                )

            actions = ["Run ML Crop Recommendation", "View Profit Calculator", "Order Certified Seeds"]

        # 5. GENERAL / WEATHER INQUIRY
        else:
            if lang == "ta":
                reply = (
                    f"வணக்கம்! உங்கள் {loc} பண்ணை ({crop}, {farm_size} ஏக்கர்) குறித்து உங்கள் கேள்விக்கு உதவ நான் தயார். "
                    f"தற்போதைய வானிலை: {weather}. உங்கள் பயிர் உரம், நீர் பாசனம் அல்லது பூச்சி மேலாண்மை பற்றி கேளுங்கள்."
                )
            elif lang == "te":
                reply = (
                    f"నమస్కారం! మీ {loc} పొలం ({crop}, {farm_size} ఎకరాలు) సంబంధిత ప్రశ్నలకు సమాధానం ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను. "
                    f"ప్రస్తుత వాతావరణం: {weather}."
                )
            elif lang == "hi":
                reply = (
                    f"नमस्ते! आपके {loc} खेत ({crop}, {farm_size} एकड़) के लिए मैं सदैव उपलब्ध हूँ। "
                    f"वर्तमान मौसम: {weather}। आप खाद, सिंचाई, मौसम या फसल रोग के बारे में पूछ सकते हैं।"
                )
            else:
                reply = (
                    f"Hello! I am your Kisan AI Saathi. For your {farm_size} acre {crop} farm in {loc} ({soil}), "
                    f"current weather is {weather}. You can ask about fertilization, water timing, yellowing leaves, or mandi prices."
                )

            actions = ["Crop Recommendation", "Water Advice", "Weather Forecast"]

        return {
            "reply": reply,
            "language": lang,
            "audio_text": reply,
            "suggested_actions": actions,
            "context_used": {
                "location": loc,
                "crop": crop,
                "soil": soil,
                "farm_size": farm_size,
                "weather": weather
            }
        }

assistant_service = AssistantService()
